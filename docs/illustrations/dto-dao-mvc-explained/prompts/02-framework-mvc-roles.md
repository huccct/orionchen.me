---
illustration_id: 02
type: framework
style: vector-illustration
palette: macaron
---

MVC 就是一家饭馆的三种分工 - 中文框架关系图

STRUCTURE: 横向关系图。最左边是一位顾客，中央是一个大圆角饭馆框架，框架内从左到右排列 View、Controller、Model 三个节点。上方箭头表示请求向右走，下方箭头表示结果向左返回。

NODES:
- 顾客：简化人物，提出“来一份宫保鸡丁”。
- View：菜单和点单屏图标，中文主标签“View”，中文解释“给顾客看”。
- Controller：服务员拿着点单板，中文主标签“Controller”，中文解释“接住请求，安排处理”。
- Model：厨房、锅和订单规则卡，中文主标签“Model”，中文解释“处理数据和业务规则”。

RELATIONSHIPS:
- 顾客 → View：箭头标签“看到、点击”。
- View → Controller：箭头标签“请求”。
- Controller → Model：箭头标签“请处理”。
- Model → Controller → View → 顾客：下方反向箭头，统一标签“结果返回”。
- Controller 节点旁放一个小小禁止符号，文字“服务员不炒菜”，帮助理解 Controller 不承担业务逻辑。

LABELS: “MVC”“View”“给顾客看”“Controller”“接住请求，安排处理”“Model”“处理数据和业务规则”“看到、点击”“请求”“请处理”“结果返回”“服务员不炒菜”。所有文字必须是简体中文或指定英文缩写，准确易读。

COLORS: 暖奶油背景 #F5F0E8；View 节点用马卡龙蓝 #A8D8EA；Controller 节点用马卡龙桃 #FFD5C2；Model 节点用马卡龙薄荷 #B5E5CF；关系框用薰衣草 #D5C6E0；轮廓文字用深炭色 #2D2D2D；珊瑚红 #E8655A 仅用于“服务员不炒菜”的禁止符号。Color values and color names are rendering guidance only — do NOT display color names, hex codes, or palette labels as visible text in the image.

STYLE: 扁平矢量框架图，粗细一致的深色闭合轮廓，圆角卡片和粗箭头，玩具模型般简洁亲切，无渐变、无 3D、无复杂背景。Human figures: simplified stylized silhouettes, not photorealistic. Text should be large and prominent with friendly handwritten-style fonts. Clean composition with generous white space.

ASPECT: 16:9，结构清楚优先，信息密度中等。
