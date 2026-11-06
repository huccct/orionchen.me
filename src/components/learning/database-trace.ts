export const databaseStrategies = {
  naive: '先查后写（反例）',
  atomic: '条件更新 + 事务',
  locked: '行锁读取 + 事务',
}
export type DatabaseStrategy = keyof typeof databaseStrategies
export type DatabaseStep = {
  title: string
  detail: string
  stock: number
  orders: number
  a: string
  b: string
}
export const databaseSql: Record<DatabaseStrategy, string> = {
  naive:
    '-- A、B 各自执行；Read Committed\nBEGIN;\nSELECT stock FROM products WHERE id = 1;\n-- 应用都读到 1，算出 0\nUPDATE products SET stock = 0 WHERE id = 1;\nINSERT INTO orders (product_id) VALUES (1);\nCOMMIT;',
  atomic:
    'BEGIN;\nUPDATE products SET stock = stock - 1\nWHERE id = 1 AND stock > 0 RETURNING stock;\n-- 返回 1 行才插入订单；0 行则结束\nINSERT INTO orders (product_id) VALUES (1);\nCOMMIT;\n-- 插入失败必须 ROLLBACK',
  locked:
    'BEGIN;\nSELECT stock FROM products WHERE id = 1 FOR UPDATE;\n-- 拿到锁后检查 stock > 0，才继续\nUPDATE products SET stock = stock - 1 WHERE id = 1;\nINSERT INTO orders (product_id) VALUES (1);\nCOMMIT;\n-- 插入失败必须 ROLLBACK',
}

// ponytail: 固定 PostgreSQL Read Committed 交错顺序；真实并发保证需另用数据库集成测试验证。
export function databaseTrace(strategy: DatabaseStrategy, failOrder: boolean): DatabaseStep[] {
  const steps: DatabaseStep[] = [
    {
      title: '初始库存只有 1 件',
      detail:
        'A、B 各购买一件同款商品。以下库存和订单数只展示已提交数据，事务内暂存值在买家状态中说明。',
      stock: 1,
      orders: 0,
      a: '准备购买',
      b: '准备购买',
    },
  ]
  if (strategy === 'naive') {
    steps.push({
      title: '两人都读到旧库存',
      detail: '普通 SELECT 不锁住后续业务判断。A、B 都读到 1，各自在应用中计算出新库存 0。',
      stock: 1,
      orders: 0,
      a: '读到 1，准备写 0',
      b: '读到 1，准备写 0',
    })
  }
  steps.push({
    title: 'A 扣减，B 等待写锁',
    detail:
      strategy === 'locked'
        ? 'A 通过 FOR UPDATE 获得行锁，检查库存后暂存扣减。B 的锁定读取等待 A 结束。'
        : strategy === 'atomic'
          ? 'A 的条件 UPDATE 匹配一行并暂存扣减；B 更新同一行时等待。'
          : 'A 把库存写为 0，写入取得行锁；B 的 UPDATE 等待，但它准备写入的仍是旧值算出的常量 0。',
    stock: 1,
    orders: 0,
    a: '事务内库存 0，订单待插入',
    b: '等待 A 释放行锁',
  })
  steps.push({
    title: failOrder ? 'A 建单失败，回滚' : 'A 建单成功，提交',
    detail: failOrder
      ? '模拟 A 的订单插入报错，事务整体回滚，扣减未提交。库存仍为 1；释放行锁。'
      : '扣库存与订单同时提交。已提交库存变为 0，订单为 1；释放行锁。',
    stock: failOrder ? 1 : 0,
    orders: failOrder ? 0 : 1,
    a: failOrder ? '失败，已回滚' : '购买成功',
    b: '继续执行',
  })
  const bSucceeds = strategy === 'naive' || failOrder
  steps.push({
    title: bSucceeds ? 'B 获得购买资格' : 'B 发现已售罄',
    detail:
      strategy === 'naive'
        ? 'B 不重新检查，直接写入之前算出的常量 0。即使 A 已买走唯一库存，也准备创建订单。'
        : strategy === 'atomic'
          ? 'PostgreSQL Read Committed 下，等待结束后在最新行版本上重检 stock > 0。只有满足条件、返回一行时才能创建订单。'
          : 'B 拿到行锁后读取当前库存，重新判断是否大于 0；不能沿用等待前的判断。',
    stock: failOrder ? 1 : 0,
    orders: failOrder ? 0 : 1,
    a: failOrder ? '失败，已回滚' : '购买成功',
    b: bSucceeds ? '事务内库存 0，准备建单' : '售罄，不建单',
  })
  steps.push({
    title: '检查最终业务结果',
    detail:
      strategy === 'naive' && !failOrder
        ? '库存是 0，CHECK(stock >= 0) 也通过了，但卖出两件：旧值覆盖掩盖了超卖。仅有事务不够。'
        : '只有一笔购买成功，已提交库存为 0，订单为 1。此案例没有支付、发货或重复请求。',
    stock: 0,
    orders: strategy === 'naive' && !failOrder ? 2 : 1,
    a: failOrder ? '失败，已回滚' : '购买成功',
    b: bSucceeds ? '购买成功' : '售罄，不建单',
  })
  return steps
}
