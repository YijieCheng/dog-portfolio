/* ============================================================
   SHARED DATA — 工作类型 / 分类 / 项目数据（全站共用）
   两大工作类型：摄影作品（photo）· 摄像作品（video）
   图片用 LoremFlickr 免费图库占位，加载失败自动回退渐变。
   后续替换：把 kw / cover 改成真实图片路径，或在 imgURL 内改数据源。
   ============================================================ */

// 免费图库占位图地址；lock 固定使返回图稳定不变
function imgURL(kw, w, h, lock){
  return "https://loremflickr.com/" + w + "/" + h + "/" + encodeURIComponent(kw) + "?lock=" + lock;
}

// 默认传播效果（项目可覆盖）
const DEFAULT_RESULTS = [["5M+","全网曝光量"],["120+","媒体报道"],["30+","平台推荐"],["10W+","互动数据"]];

const CATS = {

  /* ═══════════ 摄像作品 VIDEOGRAPHY（11 类，顺序对齐实际目录）═══════════ */

  creative:{
    group:"video", no:"01", key:"creative", cn:"创意宣传", en:"CREATIVE CAMPAIGN", cover:"city,architecture,china",
    desc:"以电影化的叙事和视听语言，为城市、景区与品牌打造有温度、有记忆点的创意宣传片。",
    projects:[
      {id:"ningbo-city", cn:"宁波城市宣传片", en:"NINGBO CITY PROMO", dur:"03:20", year:"2026", type:"城市宣传片", client:"宁波文旅集团", location:"宁波", kw:"city,skyline,river", qq:"l3285zcdsx3",
        video:"https://aaron-video-1387273792.cos.ap-shanghai.myqcloud.com/%E6%9C%89%E7%A5%A8%E5%B0%B1GO%E4%BA%86%20%E6%A0%87%E8%AF%86%EF%BC%884K%EF%BC%89.mp4",
        context:"以城市为主角，人文为线索。我们用航拍、延时与人物特写，展现宁波从三江口的晨曦到老外滩夜色的一天。",
        concept:"用一条片子讲清楚一座城的过去、现在与向往，让看的人想要立刻出发。",
        results:[["8M+","全网曝光量"],["200+","媒体报道"],["35+","平台推荐"],["15W+","互动数据"]]},
      {id:"mountains-sea", cn:"山海之间", en:"BETWEEN MOUNTAINS & SEA", dur:"02:46", year:"2025", type:"文旅宣传", client:"舟山文旅", location:"舟山", kw:"island,sea,coast", qq:"r3172n52ac1",
        video:"https://pub-9b5bee0f1c8842a98e246f30274952d6.r2.dev/AI%E7%94%9F%E6%88%90.mov",
        context:"从四明山的云海到东海的潮汐，记录这片土地上山与海的对话。",
        concept:"以自然的呼吸为节奏，把地理的辽阔转化为情感的辽阔。"},
      {id:"old-street", cn:"老街新生", en:"NEW LIFE OF OLD STREET", dur:"03:15", year:"2025", type:"文旅宣传", client:"文旅集团", location:"宁波", kw:"oldtown,street,china", douyin:"7639590279997132072",
        context:"青砖黛瓦、烟火小吃、手作匠人——南塘老街在慢镜头里复活它的人情味。",
        concept:"用'新与旧'的对照叙事，呈现一条老街如何被年轻人重新点亮。"},
      {id:"warmth", cn:"文化的温度", en:"WARMTH OF CULTURE", dur:"02:30", year:"2024", type:"纪录短片", client:"市文化馆", location:"宁波", kw:"culture,craft,hands",
        context:"四季流转下的村落与手艺人，用纪录片的语言记录人与传统的相处。",
        concept:"把'文化'落到具体的人和手上，让宏大主题变得可触可感。"}
    ]
  },
  launch:{
    group:"video", no:"02", key:"launch", cn:"发布会", en:"PRESS & LAUNCH", cover:"conference,stage,launch",
    desc:"新品发布、战略发布、品牌焕新——用一支节奏明快的发布会影像记录高光时刻并完成二次传播。",
    projects:[
      {id:"product-launch", cn:"新品发布会全程纪录", en:"PRODUCT LAUNCH", dur:"03:00", year:"2026", type:"发布会纪录", client:"科技品牌", location:"宁波", kw:"conference,stage,spotlight",
        context:"从签到、暖场到主讲揭幕，多机位完整记录一场发布会的节奏与情绪。",
        concept:"以'倒计时—揭幕—欢呼'为叙事骨架，把现场的紧张与高潮如实还原。"},
      {id:"strategy", cn:"战略发布会快剪", en:"STRATEGY EVENT", dur:"01:30", year:"2026", type:"发布会快剪", client:"集团总部", location:"宁波", kw:"presentation,keynote,audience",
        context:"两小时的战略发布，浓缩成一分半的高光快剪，当天即可分发。",
        concept:"用关键词卡点与现场金句，把'战略'讲得有节奏、有冲击。"},
      {id:"brand-night", cn:"品牌之夜现场", en:"BRAND NIGHT", dur:"02:20", year:"2025", type:"发布活动", client:"时尚品牌", location:"上海", kw:"event,lights,gala",
        context:"红毯、走秀、灯光秀，记录一场品牌之夜的高级感与仪式感。",
        concept:"以光影与质感为主语，让影像本身成为品牌调性的延伸。"}
    ]
  },
  ad:{
    group:"video", no:"03", key:"ad", cn:"广告宣传", en:"COMMERCIAL FILM", cover:"studio,advertising,light",
    desc:"从 TVC 到短视频广告，用强冲击的画面和清晰的卖点，让品牌在几秒内被记住、被种草。",
    projects:[
      {id:"brand-tvc", cn:"文旅品牌形象 TVC", en:"BRAND TVC", dur:"00:15", year:"2026", type:"品牌广告", client:"文旅集团", location:"宁波", kw:"billboard,brand,advertising",
        context:"15 秒，要在电梯、电视、户外大屏上都成立。我们把品牌主张压缩成一记视觉锤。",
        concept:"一句口号 + 一个画面记忆点，让品牌在最短时间里被记住。"},
      {id:"homestay", cn:"精品民宿广告短片", en:"HOMESTAY FILM", dur:"00:45", year:"2026", type:"产品广告", client:"民宿品牌", location:"宁波", kw:"hotel,room,interior",
        context:"清晨的光、窗外的山、被窝里的猫，把度假的向往拍成一条种草片。",
        concept:"以'慢'对抗都市的'快'，用细节唤起逃离的冲动。"},
      {id:"food", cn:"美食探店广告", en:"FOOD COMMERCIAL", dur:"00:30", year:"2025", type:"产品广告", client:"餐饮品牌", location:"宁波", kw:"food,restaurant,delicious",
        context:"升格镜头下的拉丝、爆汁与烟火气，让人隔着屏幕就饿了。",
        concept:"用极致的食物质感特写，把'好吃'变成可以看见的画面。"}
    ]
  },
  events:{
    group:"video", no:"04", key:"events", cn:"活动记录", en:"EVENT HIGHLIGHTS", cover:"concert,crowd,stage",
    desc:"赛事、节庆、年会、典礼——在最短时间内还原现场节奏与情绪，让一支快剪成为活动最好的记忆载体。",
    projects:[
      {id:"marathon", cn:"宁波国际马拉松快剪", en:"NINGBO MARATHON", dur:"02:30", year:"2026", type:"赛事快剪", client:"市体育局", location:"宁波", kw:"marathon,running,city",
        context:"两万人同时起跑的清晨，我们用 8 个机位埋伏在赛道沿线，捕捉补给站的笑脸、冲线时的拥抱。",
        concept:"以城市地标为锚点，把奔跑的节奏剪进城市的脉搏，48 小时内交付赛事高光。"},
      {id:"basketball", cn:"城市篮球公开赛集锦", en:"CITY BASKETBALL", dur:"01:00", year:"2026", type:"赛事集锦", client:"赛事运营方", location:"宁波", kw:"basketball,sport,arena",
        context:"四天赛程、上百场比赛，我们只保留最燃的那些瞬间：扣篮、绝杀、全场欢呼。",
        concept:"快节奏卡点配合现场鼓点，把一届赛事浓缩成最热血的一分钟。"},
      {id:"festival", cn:"星巢音乐节现场快剪", en:"MUSIC FESTIVAL", dur:"03:10", year:"2025", type:"节庆快剪", client:"文旅集团", location:"舟山", kw:"music,festival,lights",
        context:"灯光、人浪、舞台烟火，三机位多角度记录两天音乐节的沸腾现场。",
        concept:"用光与声的节奏构建叙事，让没到场的人也能感受到现场的热度。"}
    ]
  },
  oral:{
    group:"video", no:"05", key:"oral", cn:"口播讲解", en:"TALKING HEAD", cover:"presenter,microphone,studio",
    desc:"真人口播 + 图文动画，把政策、产品、知识点讲得清楚又有亲和力，适配信息流分发。",
    projects:[
      {id:"policy", cn:"政策解读口播", en:"POLICY EXPLAINER", dur:"01:20", year:"2026", type:"口播讲解", client:"政务机构", location:"宁波", kw:"presenter,host,studio",
        context:"把一份冗长的政策文件，拆成一段口播 + 动态图表，让群众一听就懂。",
        concept:"以'问题—解读—结论'的结构，把官方信息翻译成日常语言。"},
      {id:"product-oral", cn:"产品卖点口播", en:"PRODUCT TALK", dur:"00:45", year:"2026", type:"口播带货", client:"电商品牌", location:"宁波", kw:"vlogger,talking,camera",
        context:"主播对镜口播，配合产品特写与字幕卡点，做成可批量复用的带货模板。",
        concept:"用'痛点—卖点—行动'三段式，把一次口播变成一次转化。"},
      {id:"knowledge", cn:"知识科普口播", en:"KNOWLEDGE CLIP", dur:"01:00", year:"2025", type:"科普口播", client:"文化机构", location:"宁波", kw:"teacher,explain,whiteboard",
        context:"一个知识点、一块白板、一段口播，把科普做得轻松好记。",
        concept:"以一句反常识的钩子开场，用画面辅助降低理解门槛。"}
    ]
  },
  celebrity:{
    group:"video", no:"06", key:"celebrity", cn:"明星祝福", en:"CELEBRITY GREETING", cover:"celebrity,greeting,portrait",
    desc:"邀请明星 / 达人录制定制祝福与口播，为品牌活动、节庆与城市推介造势引流。",
    projects:[
      {id:"festival-wish", cn:"明星节庆祝福", en:"STAR GREETING", dur:"00:30", year:"2026", type:"明星祝福", client:"文旅集团", location:"宁波", kw:"celebrity,smile,portrait",
        context:"明星对镜送上定制节庆祝福，为城市文旅活动预热造势。",
        concept:"用熟悉的面孔 + 在地化的祝福，快速拉近与受众的距离。"},
      {id:"brand-endorse", cn:"达人品牌祝福", en:"INFLUENCER WISH", dur:"00:20", year:"2026", type:"达人口播", client:"品牌部", location:"宁波", kw:"influencer,phone,selfie", vertical:true,
        context:"多位达人接力录制品牌祝福，形成矩阵式社媒投放素材。",
        concept:"以竖屏第一人称的亲切感，让祝福像朋友的私信。"},
      {id:"city-call", cn:"城市推介明星打 call", en:"CITY SHOUTOUT", dur:"00:40", year:"2025", type:"城市推介", client:"城市宣传部", location:"宁波", kw:"microphone,star,stage",
        context:"明星为城市站台打 call，把个人影响力转化为城市曝光。",
        concept:"用'我替我的城市说句话'的口吻，唤起在地认同与外地向往。"}
    ]
  },
  interview:{
    group:"video", no:"07", key:"interview", cn:"趣味采访", en:"FUN INTERVIEW", cover:"street,interview,microphone",
    desc:"街头快问快答、趣味盘点、反差采访——用轻松的对话和强节奏剪辑制造可传播的爆点。",
    projects:[
      {id:"street", cn:"街头快问快答", en:"STREET Q&A", dur:"02:00", year:"2026", type:"趣味采访", client:"新媒体部", location:"宁波", kw:"street,people,interview",
        context:"举着话筒在街头随机发问，用最真实的反应制造笑点与共鸣。",
        concept:"以'反差答案'为剪辑爆点，把街访做成停不下来的合集。"},
      {id:"tourist", cn:"游客印象采访", en:"TOURIST VOX POP", dur:"01:30", year:"2026", type:"街访", client:"文旅集团", location:"宁波", kw:"tourist,smile,city",
        context:"采访来宁波的游客，收集他们对这座城市最真实的第一印象。",
        concept:"用'外地人视角'反向种草，让本地人也重新认识自己的城市。"},
      {id:"generation", cn:"两代人对话", en:"GENERATIONS TALK", dur:"02:30", year:"2025", type:"趣味对谈", client:"文化馆", location:"宁波", kw:"young,old,conversation",
        context:"让爷爷奶奶和年轻人就同一个话题各自作答，制造温暖的反差。",
        concept:"以代际差异为戏剧冲突，落点在'其实我们想的一样'。"}
    ]
  },
  documentary:{
    group:"video", no:"08", key:"documentary", cn:"人文纪实", en:"DOCUMENTARY", cover:"documentary,village,people",
    desc:"以纪实的镜头语言记录人、技艺与土地，沉淀有时间厚度的影像档案。",
    projects:[
      {id:"craftsman", cn:"守艺人纪实", en:"THE CRAFTSMAN", dur:"08:00", year:"2026", type:"人文纪录", client:"文化馆", location:"宁波", kw:"craftsman,artisan,hands",
        context:"手艺人的一双手、一段坚守，用访谈与特写记录正在消失的技艺。",
        concept:"以'手'为视觉母题，让技艺本身成为最有力的叙述者。"},
      {id:"village", cn:"古村四季", en:"VILLAGE SEASONS", dur:"06:00", year:"2025", type:"纪录短片", client:"文旅集团", location:"宁波", kw:"village,countryside,china",
        context:"用一年四季的跟拍，记录一座古村落里人与土地的相处。",
        concept:"以季节流转为时间轴，把'慢'本身拍成一种价值。"},
      {id:"market", cn:"烟火集市", en:"MARKET LIFE", dur:"04:30", year:"2025", type:"生活纪实", client:"自主拍摄", location:"宁波", kw:"market,vendor,life",
        context:"清晨的菜场、吆喝声与人情味，记录一座城市最鲜活的底色。",
        concept:"用群像式的纪实片段，拼出一幅城市生活的浮世绘。"}
    ]
  },
  explore:{
    group:"video", no:"09", key:"explore", cn:"探店探展", en:"STORE & EXHIBIT", cover:"store,exhibition,visit",
    desc:"探店、探展、探馆——第一视角带看，把空间、产品与体验拍成让人想去打卡的种草片。",
    projects:[
      {id:"store", cn:"网红餐厅探店", en:"FOOD STORE VISIT", dur:"01:30", year:"2026", type:"探店", client:"餐饮品牌", location:"宁波", kw:"restaurant,interior,food",
        context:"从环境、招牌菜到隐藏吃法，用第一视角带你把一家店逛个遍。",
        concept:"以'跟我去打卡'的沉浸视角，把探店做成可复用的种草模板。"},
      {id:"exhibition", cn:"艺术展探展", en:"ART EXHIBITION", dur:"02:00", year:"2026", type:"探展", client:"美术馆", location:"宁波", kw:"gallery,exhibition,art",
        context:"带看一场艺术展，从动线到重点展品，替观众提前划好重点。",
        concept:"用'看展攻略'的实用框架，降低观展门槛、提升到场意愿。"},
      {id:"museum", cn:"博物馆探馆", en:"MUSEUM TOUR", dur:"02:30", year:"2025", type:"探馆", client:"博物馆", location:"宁波", kw:"museum,artifact,hall",
        context:"穿过一件件文物，讲清楚它们背后的故事与看点。",
        concept:"以'镇馆之宝'为钩子，把一次探馆变成一堂轻松的历史课。"}
    ]
  },
  news:{
    group:"video", no:"10", key:"news", cn:"新闻资讯", en:"NEWS & UPDATES", cover:"newsroom,camera,broadcast",
    desc:"面向新闻信息流的快产快发短视频，竖屏优先、字幕清晰，第一时间把现场送达。",
    projects:[
      {id:"festival-news", cn:"文旅节开幕报道", en:"FESTIVAL NEWS", dur:"01:00", year:"2026", type:"新闻短片", client:"宣传部门", location:"宁波", kw:"ceremony,stage,festival", vertical:true,
        context:"开幕当天 4 小时出片，竖屏信息流定制，适配各大平台分发。",
        concept:"用新闻的准确 + 短视频的节奏，做到既权威又好看。"},
      {id:"live-feed", cn:"重大活动信息流短片", en:"LIVE FEED", dur:"00:45", year:"2026", type:"信息流", client:"运营方", location:"宁波", kw:"crowd,event,live", vertical:true,
        context:"现场即拍即剪，配合滚动字幕和数据卡片，做成可连发的系列。",
        concept:"以模块化模板支撑高频更新，保证系列视觉统一。"},
      {id:"gov-news", cn:"政企新闻短视频", en:"GOV NEWS", dur:"01:00", year:"2025", type:"新闻短片", client:"政企客户", location:"宁波", kw:"press,microphone,podium", vertical:true,
        context:"政务发布的标准化短视频模板，规范、严谨、传播友好。",
        concept:"在严谨的框架内注入清晰的信息层级，提升传播效率。"}
    ]
  },
  app:{
    group:"video", no:"11", key:"app", cn:"应用介绍", en:"APP INTRODUCTION", cover:"smartphone,technology,interface",
    desc:"用动效演示和真机录屏，把 App、小程序、系统的核心功能讲得简单又好看。",
    projects:[
      {id:"app-demo", cn:"文旅 App 功能演示", en:"APP DEMO", dur:"01:20", year:"2026", type:"产品演示", client:"产品团队", location:"宁波", kw:"app,phone,screen",
        context:"从订票到导览的完整使用流程，UI 动效配合旁白，让用户一看就会用。",
        concept:"以'一次旅程'为线索串联功能，把产品讲成一个故事而非功能清单。"},
      {id:"mini", cn:"智慧景区小程序介绍", en:"MINI PROGRAM", dur:"01:00", year:"2026", type:"产品演示", client:"景区运营", location:"宁波", kw:"map,navigation,mobile",
        context:"扫码入园、电子地图、AR 讲解，把景区的数字化体验讲给游客听。",
        concept:"用游客视角的第一人称演示，让功能与真实场景紧密贴合。"},
      {id:"ticketing", cn:"票务系统介绍片", en:"TICKETING SYSTEM", dur:"02:00", year:"2025", type:"系统演示", client:"系统服务商", location:"宁波", kw:"dashboard,software,laptop",
        context:"面向 B 端的系统演示，后台到前台一条线，突出效率与稳定。",
        concept:"用数据流的可视化呈现系统价值，让决策者看懂'快'与'稳'。"}
    ]
  },

  /* ═══════════ 摄影作品 PHOTOGRAPHY（占位分类，待替换为真实分类）═══════════ */

  "p-portrait":{
    group:"photo", no:"01", key:"p-portrait", cn:"人像写真", en:"PORTRAIT", cover:"portrait,studio,fashion",
    desc:"棚拍与外景人像，用光影与情绪塑造每一张有故事的面孔。",
    projects:[
      {id:"studio-portrait", cn:"棚拍人像写真", en:"STUDIO PORTRAIT", dur:"32 张", year:"2026", type:"人像摄影", client:"个人客户", location:"宁波", kw:"portrait,studio,fashion",
        context:"在可控的影棚光线下，为人物找到最贴合气质的那一面。",
        concept:"以光塑形、以情绪定调，让一组写真讲清一个人的状态。"},
      {id:"outdoor-portrait", cn:"外景人像写真", en:"OUTDOOR PORTRAIT", dur:"48 张", year:"2025", type:"写真", client:"个人客户", location:"宁波", kw:"portrait,outdoor,sunset",
        context:"借自然光与场景，把人物放回真实的环境里。",
        concept:"用环境叙事，让人像不只是脸，更是一段时间与心境。"}
    ]
  },
  "p-event":{
    group:"photo", no:"02", key:"p-event", cn:"活动跟拍", en:"EVENT COVERAGE", cover:"event,photography,crowd",
    desc:"年会、典礼、婚礼——全程跟拍，定格每一个值得保存的瞬间。",
    projects:[
      {id:"annual", cn:"企业年会跟拍", en:"ANNUAL GALA", dur:"120 张", year:"2026", type:"活动摄影", client:"企业客户", location:"宁波", kw:"event,gala,crowd",
        context:"从签到到颁奖、从舞台到后台，完整记录一场年会的高光与花絮。",
        concept:"以纪实抓拍为主，把现场的情绪与关系真实留存。"},
      {id:"wedding", cn:"婚礼当天跟拍", en:"WEDDING DAY", dur:"200 张", year:"2025", type:"婚礼摄影", client:"个人客户", location:"宁波", kw:"wedding,couple,celebration",
        context:"一整天的陪伴式跟拍，记录从晨起到仪式的每个动情时刻。",
        concept:"以时间线叙事，把一天拍成一本可翻阅的故事书。"}
    ]
  },
  "p-arch":{
    group:"photo", no:"03", key:"p-arch", cn:"建筑空间", en:"ARCHITECTURE", cover:"architecture,interior,building",
    desc:"酒店、办公、商业空间——用结构与光线，呈现空间的设计语言与质感。",
    projects:[
      {id:"hotel", cn:"精品酒店空间", en:"HOTEL SPACE", dur:"36 张", year:"2026", type:"空间摄影", client:"酒店品牌", location:"宁波", kw:"hotel,interior,architecture",
        context:"在不同时段捕捉空间的光，呈现酒店从大堂到客房的高级感。",
        concept:"以线条与留白构图，让空间自己说话。"},
      {id:"office", cn:"办公空间摄影", en:"OFFICE SPACE", dur:"28 张", year:"2025", type:"空间摄影", client:"企业客户", location:"宁波", kw:"office,interior,design",
        context:"记录办公空间的设计细节与使用场景，兼顾品牌与实用。",
        concept:"用秩序感的构图，传达企业的专业与气质。"}
    ]
  },
  "p-landscape":{
    group:"photo", no:"04", key:"p-landscape", cn:"风光风景", en:"LANDSCAPE", cover:"landscape,mountain,sea",
    desc:"山海、城市、四季——用风光影像沉淀一方土地的辽阔与气象。",
    projects:[
      {id:"mountain", cn:"山海风光", en:"MOUNTAIN & SEA", dur:"60 张", year:"2026", type:"风光摄影", client:"文旅集团", location:"舟山", kw:"landscape,mountain,sea",
        context:"在最好的光线里等待，记录山与海最动人的那一刻。",
        concept:"以大景别与极简构图，把自然的辽阔转化为情感的辽阔。"},
      {id:"city-night", cn:"城市夜景", en:"CITY NIGHT", dur:"40 张", year:"2025", type:"风光摄影", client:"城市宣传部", location:"宁波", kw:"city,night,skyline",
        context:"蓝调时刻的天际线与灯火，呈现一座城市的夜晚气质。",
        concept:"用长曝光与色温控制，让夜景既真实又有诗意。"}
    ]
  },
  "p-product":{
    group:"photo", no:"05", key:"p-product", cn:"美食产品", en:"FOOD & PRODUCT", cover:"food,product,studio",
    desc:"美食与商品的质感影像，让画面替产品完成第一次种草。",
    projects:[
      {id:"food-photo", cn:"美食摄影", en:"FOOD PHOTOGRAPHY", dur:"45 张", year:"2026", type:"美食摄影", client:"餐饮品牌", location:"宁波", kw:"food,gourmet,studio",
        context:"用布光与摆盘还原食物最诱人的状态，适配菜单与社媒。",
        concept:"以质感特写为核心，把'好吃'变成看得见的画面。"},
      {id:"product-photo", cn:"商品产品摄影", en:"PRODUCT SHOT", dur:"30 张", year:"2025", type:"产品摄影", client:"电商品牌", location:"宁波", kw:"product,studio,light",
        context:"为电商详情页拍摄高质感产品图，兼顾真实与美感。",
        concept:"用干净的布光与构图，突出材质、细节与卖点。"}
    ]
  },
  "p-doc":{
    group:"photo", no:"06", key:"p-doc", cn:"纪实人文", en:"DOCUMENTARY PHOTO", cover:"documentary,portrait,street",
    desc:"以纪实摄影记录城市面孔与在地文化，留存有温度的影像档案。",
    projects:[
      {id:"faces", cn:"城市面孔", en:"CITY FACES", dur:"80 张", year:"2026", type:"纪实摄影", client:"自主拍摄", location:"宁波", kw:"street,portrait,people",
        context:"在街头记录形形色色的普通人，拼出一座城市的群像。",
        concept:"以抓拍的真实，留住时代里一张张具体的脸。"},
      {id:"heritage-photo", cn:"非遗影像", en:"HERITAGE FRAMES", dur:"55 张", year:"2025", type:"纪实摄影", client:"文化馆", location:"宁波", kw:"craft,artisan,documentary",
        context:"用影像系统记录非遗技艺的工序、工具与传承人。",
        concept:"以档案式的拍摄，为正在消失的技艺留下凭证。"}
    ]
  }

};

/* ── 工作类型分组：定义每个类型包含哪些分类及顺序 ── */
const GROUPS = {
  photo:{ key:"photo", cn:"摄影作品", en:"PHOTOGRAPHY",
    order:["p-portrait","p-event","p-arch","p-landscape","p-product","p-doc"] },
  video:{ key:"video", cn:"摄像作品", en:"VIDEOGRAPHY",
    order:["creative","launch","ad","events","oral","celebrity","interview","documentary","explore","news","app"] }
};
const GROUP_ORDER = ["photo","video"];

// 向后兼容：ORDER 默认指向摄像分类顺序
const ORDER = GROUPS.video.order;

// 扁平化项目查找表，key = "<catKey>/<projId>"
const PROJECTS = {};
Object.keys(CATS).forEach(function(k){
  CATS[k].projects.forEach(function(p){
    PROJECTS[k+"/"+p.id] = Object.assign({catKey:k, catCn:CATS[k].cn, catNo:CATS[k].no, group:CATS[k].group}, p);
  });
});
