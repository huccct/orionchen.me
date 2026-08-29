---
illustration_id: 03
type: flowchart
style: vector-illustration
palette: macaron
---

一张订单怎样走完整个系统 - 中文流程图

Layout: 从左到右的单行主流程，七个节点用粗箭头连接；底部用一条较细的反向箭头表示处理结果返回给顾客。DTO 画成在 Controller 和 Model 之间移动的小票，而不是与 MVC 同等级的大部门。

STEPS:
1. “顾客” - 点击下单，人物与手机图标。
2. “View” - 页面展示和表单图标，注释“收集输入”。
3. “Controller” - 服务员图标，注释“接住请求”。
4. “DTO” - 明显画成一张小票，内容仅为“桌号 / 菜品 / 数量”，注释“只带需要的数据”。
5. “Model” - 厨房和规则卡图标，注释“检查库存、计算价格”。
6. “DAO” - 仓库窗口管理员图标，注释“读取、保存”。
7. “数据库” - 整齐货架与数据库圆柱图标，注释“存放数据”。

CONNECTIONS: 主流程用粗实线箭头从左到右。DAO 与数据库之间画双向箭头，表示读取和保存。底部从 Model 绕回顾客的柔和反向箭头，标签“下单结果原路返回”。在图底部放一句总结：“MVC 管分工，DTO 带数据，DAO 管存取”。

LABELS: “顾客”“View”“收集输入”“Controller”“接住请求”“DTO”“桌号 / 菜品 / 数量”“只带需要的数据”“Model”“检查库存、计算价格”“DAO”“读取、保存”“数据库”“存放数据”“下单结果原路返回”“MVC 管分工，DTO 带数据，DAO 管存取”。所有文字必须是简体中文或指定英文缩写，准确清晰。

COLORS: 暖奶油背景 #F5F0E8；流程节点在马卡龙蓝 #A8D8EA、薄荷 #B5E5CF、薰衣草 #D5C6E0、桃色 #FFD5C2 间交替；深炭色 #2D2D2D 用于轮廓、文字与箭头；珊瑚红 #E8655A 只强调 DTO 小票和底部总结。Color values and color names are rendering guidance only — do NOT display color names, hex codes, or palette labels as visible text in the image.

STYLE: 扁平矢量教育流程图，圆角节点、粗箭头、统一深色闭合轮廓，无渐变、无 3D、无写实阴影。图标几何化，人物是简化卡通剪影。Text should be large and prominent with friendly handwritten-style fonts. Clean composition with generous white space. Simple background.

ASPECT: 16:9，信息密度较高但不拥挤，优先保证中文字可读。
