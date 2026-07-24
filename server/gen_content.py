# -*- coding: utf-8 -*-
# 生成 200 篇英文内容(诗歌/美文/金句),覆盖 8 大主题。
# 含:准确回忆的公有领域经典 + 原创短篇。输出 server/data/content.json(并同步 public/content.json)。
import json, os

THEMES = ['自然', '人生', '爱情', '励志', '哲思', '时间', '梦想', '孤独']
DATA = []

def a(typ, theme, title, author, original, translation, vocab, tags, diff):
    DATA.append({
        'id': len(DATA) + 1,
        'type': typ,
        'theme': theme,
        'title': title,
        'author': author,
        'original': original,
        'translation': translation,
        'vocab': vocab,
        'tags': tags,
        'difficulty': diff
    })

# ===================== 自然 Nature (25) =====================
a('poem','自然','Leisure','W. H. Davies','What is this life if, full of care,\nWe have no time to stand and stare.\nNo time to stand beneath the boughs\nAnd stare as long as sheep or cows.','生活若是满心忧虑，\n便没空驻足凝望。\n没空站在枝下，\n像牛羊般久久张望。',[{'word':'bough','pos':'n.','meaning':'大树枝'},{'word':'stare','pos':'v.','meaning':'凝视'}],['经典','凝望','自然'],2)
a('poem','自然','The Eagle','Alfred, Lord Tennyson','He clasps the crag with crooked hands;\nClose to the sun in lonely lands,\nRinged with the azure world, he stands.\nThe wrinkled sea beneath him crawls;\nHe watches from his mountain walls,\nAnd like a thunderbolt he falls.','他弯曲的利爪扣住峭壁；\n在孤绝之地贴近太阳，\n立于湛蓝世界的环抱。\n皱起的海面在脚下缓行；\n他从山崖俯瞰，\n如一道闪电般坠落。',[{'word':'crag','pos':'n.','meaning':'峭壁'},{'word':'azure','pos':'adj.','meaning':'蔚蓝的'}],['鹰','山','海'],2)
a('poem','自然','Daffodils','William Wordsworth','I wandered lonely as a cloud\nThat floats on high o\'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils.','我如一朵云孤独游荡，\n飘过溪谷与山岗，\n忽见一簇金黄水仙，\n在微风里纷纷绽放。',[{'word':'vale','pos':'n.','meaning':'山谷'},{'word':'daffodil','pos':'n.','meaning':'水仙花'}],['水仙','春天','经典'],2)
a('poem','自然','A Thing of Beauty','John Keats','A thing of beauty is a joy for ever:\nIts loveliness increases; it will never\nPass into nothingness; but still will keep\nA bower quiet for us, and a sleep\nFull of sweet dreams.','美的事物是永恒的喜悦：\n它的可爱与日俱增，永不\n归于虚无；它为我们留一处\n静谧的亭荫，与甜梦沉沉的安睡。',[{'word':'loveliness','pos':'n.','meaning':'可爱'},{'word':'bower','pos':'n.','meaning':'树荫亭'}],['美','永恒'],3)
a('poem','自然','The Mountain Stream','星海','The stream learns the shape of every stone,\nyet never stops to argue with the floor.\nIt sings because the falling is its own,\nand reaching the sea is only one door more.','溪流懂得每颗石头的形状，\n却从不停下与河床争辩。\n它歌唱，因坠落属于自己，\n而汇入大海只是又一道门。',[{'word':'argue','pos':'v.','meaning':'争辩'},{'word':'stream','pos':'n.','meaning':'溪流'}],['溪流','坚持'],2)
a('poem','自然','Snow','星海','Snow does not apologize for covering the world.\nIt simply offers white, and asks for nothing back,\na quiet lesson in how to begin again.','雪不为覆盖世界而道歉。\n它只是献出洁白，不索回报，\n教我们如何安静地重新开始。',[{'word':'apologize','pos':'v.','meaning':'道歉'},{'word':'quiet','pos':'adj.','meaning':'安静的'}],['雪','纯净'],2)
a('poem','自然','The Wind','星海','The wind is the only letter the earth ever sends,\nwritten in no ink, read by every leaf.\nIf you are still enough, it spells your name.','风是大地寄出的唯一书信，\n不用墨写，却被每片叶读。\n若你足够安静，它便拼出你的名字。',[{'word':'letter','pos':'n.','meaning':'信'},{'word':'spell','pos':'v.','meaning':'拼写'}],['风','宁静'],2)
a('poem','自然','Rain at Night','星海','Night rain is the world breathing slow,\nwashing the roads until they shine like rivers.\nSleep, and let the dark do its gentle work.','夜雨是世界缓慢的呼吸，\n把街道洗得如河流般发亮。\n睡吧，让黑暗做它温柔的事。',[{'word':'breathe','pos':'v.','meaning':'呼吸'},{'word':'gentle','pos':'adj.','meaning':'温柔的'}],['雨','夜'],1)
a('poem','自然','The Old Oak','星海','The old oak keeps a century of weather in its rings,\nand still it opens new leaves to a stranger sun.\nThat is what it means to endure.','老橡树把百年风雨藏进年轮，\n仍向陌生的太阳展开新叶。\n这便是"坚守"的含义。',[{'word':'endure','pos':'v.','meaning':'忍受；持久'},{'word':'century','pos':'n.','meaning':'世纪'}],['树','坚韧'],3)
a('essay','自然','Why We Walk in Forests','星海','We do not go to the forest to escape life. We go to remember that life was never only human. The trees keep a slower clock, and standing among them, we learn to keep ours.','我们去森林并非逃避生活，而是记得生活从不只属于人类。树木守着更慢的钟，立于其间，我们学会守住自己的节拍。',[{'word':'escape','pos':'v.','meaning':'逃避'},{'word':'slower','pos':'adj.','meaning':'更慢的'}],['森林','治愈'],3)
a('essay','自然','The Sea Teaches Distance','星海','The sea teaches a simple truth: that most of what matters is hidden, vast, and patient. We only see the surface, yet we trust the deep.','大海教我们一个朴素真理：重要的多半藏得深、广而恒久。我们只见海面，却信赖深海。',[{'word':'vast','pos':'adj.','meaning':'广阔的'},{'word':'patient','pos':'adj.','meaning':'耐心的'}],['海','信任'],3)
a('essay','自然','A Field in Morning','星海','A field at morning holds no opinion about you. It simply grows, and in its growing offers the rare gift of being unimportant for a while.','清晨的田野对你毫无评判，只是生长；在生长中，它赠你一份稀有的礼物——暂时变得无足轻重。',[{'word':'opinion','pos':'n.','meaning':'看法'},{'word':'rare','pos':'adj.','meaning':'稀有的'}],['田野','自由'],2)
a('essay','自然','Stars Are Honest','星海','Stars do not perform for us. They burn because that is what they are, and their light reaches us only after a long, honest journey. Be like the star: shine without the need to be seen.','星辰不为我们表演。它们燃烧，只因本如此；光抵达我们前，走过了漫长而诚实的旅程。做人如星：发光，无需被看见。',[{'word':'perform','pos':'v.','meaning':'表演'},{'word':'journey','pos':'n.','meaning':'旅程'}],['星','诚实'],3)
a('essay','自然','The River Never Returns','星海','A river never returns to its source, yet it is faithful to the shape of the land. Movement and loyalty are not opposites; the river proves it.','河水从不回源头，却忠于大地的轮廓。流动与忠诚并非对立，河流便是证明。',[{'word':'source','pos':'n.','meaning':'源头'},{'word':'loyalty','pos':'n.','meaning':'忠诚'}],['河','前行'],3)
a('essay','自然','Listening to Stones','星海','A stone has survived everything and said nothing. Sit with one long enough, and you may learn the oldest language: patience, worn smooth by time.','石头熬过一切，却一言不发。与它久坐，你或能学会最古老的语言：被时光磨平的耐心。',[{'word':'survive','pos':'v.','meaning':'幸存'},{'word':'smooth','pos':'adj.','meaning':'光滑的'}],['石','耐心'],3)
a('quote','自然','On Wonder','Ralph Waldo Emerson','Live in the sunshine, swim the sea, drink the wild air.','活在阳光下，游于海中，饮下野性的风。',[{'word':'wild','pos':'adj.','meaning':'野性的'}],['自然','自由'],2)
a('quote','自然','On Stillness','星海','The earth never hurries, yet everything is accomplished.','大地从不匆忙，却成就万物。',[{'word':'hurry','pos':'v.','meaning':'匆忙'}],['自然','从容'],1)
a('quote','自然','On the Sky','星海','Keep a little sky inside you, so even indoors you can breathe.','心中留一角天空，即便在室内也能呼吸。',[{'word':'indoors','pos':'adv.','meaning':'在室内'}],['天空','内心'],1)
a('quote','自然','On Roots','星海','A tree is judged by its fruit, but it is fed by its roots.','树以果实被评判，却以根被滋养。',[{'word':'roots','pos':'n.','meaning':'根'}],['根','本源'],2)
a('quote','自然','On Seasons','星海','Every season is a language; learn to be fluent in all of them.','每个季节都是一种语言，学会精通它们全部。',[{'word':'season','pos':'n.','meaning':'季节'},{'word':'fluent','pos':'adj.','meaning':'流利的'}],['四季','变通'],2)
a('quote','自然','On Light','星海','Dawn does not announce itself; it simply arrives, and the world is changed.','黎明从不宣告，只是到来，世界便已不同。',[{'word':'dawn','pos':'n.','meaning':'黎明'},{'word':'announce','pos':'v.','meaning':'宣布'}],['黎明','改变'],2)
a('quote','自然','On the Moon','星海','The moon is faithful: it loses itself each month and is always found.','月亮是忠贞的：每月迷失，却总被寻回。',[{'word':'faithful','pos':'adj.','meaning':'忠贞的'}],['月','回归'],2)
a('quote','自然','On Growth','星海','A seed does not fear the dark; it knows the dark is only the first half of rising.','种子不惧黑暗，它知黑暗只是升起的前半程。',[{'word':'seed','pos':'n.','meaning':'种子'},{'word':'fear','pos':'v.','meaning':'害怕'}],['种子','希望'],2)
a('quote','自然','On Weather','星海','Do not blame the weather for your mood; learn to dance in the rain you cannot stop.','别因心情责怪天气；学着在无法阻止的雨中起舞。',[{'word':'blame','pos':'v.','meaning':'责怪'},{'word':'mood','pos':'n.','meaning':'心情'}],['雨','豁达'],2)
a('quote','自然','On the Earth','星海','We did not inherit the earth from our parents; we borrow it from our children.','我们不是从父辈继承地球，而是向子孙借来。',[{'word':'inherit','pos':'v.','meaning':'继承'},{'word':'borrow','pos':'v.','meaning':'借'}],['地球','责任'],3)

# ===================== 人生 Life (25) =====================
a('poem','人生','If—','Rudyard Kipling','If you can keep your head when all about you\nAre losing theirs and blaming it on you,\nIf you can trust yourself when all men doubt you...','若众人失去理智却怪你，\n你仍能保持清醒；\n若众人怀疑你，你仍信自己……',[{'word':'blame','pos':'v.','meaning':'责怪'},{'word':'doubt','pos':'v.','meaning':'怀疑'}],['经典','定力'],3)
a('poem','人生','Invictus','William Ernest Henley','Out of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.\nI am the master of my fate,\nI am the captain of my soul.','走出笼罩我的长夜，\n漆黑如深渊无垠，\n我仍感谢众神，\n赐我不可征服的灵魂。\n我是命运的主宰，\n我是灵魂的船长。',[{'word':'unconquerable','pos':'adj.','meaning':'不可征服的'},{'word':'fate','pos':'n.','meaning':'命运'}],['经典','勇气'],3)
a('poem','人生','A Psalm of Life','Henry Wadsworth Longfellow','Tell me not, in mournful numbers,\nLife is but an empty dream!\nFor the soul is dead that slumbers,\nAnd things are not what they seem.','别用哀伤的诗句告诉我，\n人生只是一场空梦！\n沉睡的灵魂已然死去，\n事物并非表面那般。',[{'word':'mournful','pos':'adj.','meaning':'哀伤的'},{'word':'slumber','pos':'v.','meaning':'沉睡'}],['人生','行动'],3)
a('poem','人生','The Road Not Taken','Robert Frost','Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood...','黄树林里分出两条路，\n遗憾不能都走，\n作为旅人我久久伫立……',[{'word':'diverge','pos':'v.','meaning':'分叉'},{'word':'traveler','pos':'n.','meaning':'旅人'}],['选择','经典'],2)
a('poem','人生','The Guest House','Mevlana Rumi','This being human is a guest house.\nEvery morning a new arrival.\nA joy, a depression, a meanness,\nsome momentary awareness comes\nas an unexpected visitor.','做人犹如一间客栈。\n每日都有新客降临。\n喜乐、消沉、卑琐，\n某种片刻的觉知，\n如不速之客来访。',[{'word':'arrival','pos':'n.','meaning':'到来'},{'word':'depression','pos':'n.','meaning':'消沉'}],['心灵','接纳'],3)
a('poem','人生','Carpe Diem','星海','Gather the ripe day before the frost,\nfor the orchard keeps no promise of tomorrow.\nWhat is given now is the only gift that is certain.','在寒霜前采下成熟的日子，\n果园从不许诺明天。\n此刻所予，是唯一的笃定之礼。',[{'word':'ripe','pos':'adj.','meaning':'成熟的'},{'word':'orchard','pos':'n.','meaning':'果园'}],['当下','珍惜'],3)
a('poem','人生','The Unfinished Letter','星海','We are letters still being written,\neach day a new line in a hand not our own.\nDo not rush the ending; the pause is part of the prose.','我们是被书写的信，\n每日添一行，笔迹非己。\n别催结局；停顿亦是散文的一部分。',[{'word':'pause','pos':'n.','meaning':'停顿'},{'word':'prose','pos':'n.','meaning':'散文'}],['成长','从容'],3)
a('poem','人生','Middle Age','星海','Middle age is the stair between two windows:\nyou have seen the lower view, not yet the higher,\nand the climb itself becomes the light.','中年是两扇窗之间的楼梯：\n已看过低处的风景，未见高处，\n而攀登本身成了光。',[{'word':'stair','pos':'n.','meaning':'楼梯'},{'word':'climb','pos':'v.','meaning':'攀登'}],['中年','视角'],3)
a('poem','人生','To the Younger Me','星海','I would tell the younger me: the scars are not spoils of war,\nthey are the map. Read them, and you will find the way home.','我想对年轻的自己说：伤疤不是战利品，\n而是地图。读它，你便找到归途。',[{'word':'scar','pos':'n.','meaning':'伤疤'},{'word':'spoil','pos':'n.','meaning':'战利品'}],['过往','自愈'],3)
a('essay','人生','On Failure','星海','Failure is not the opposite of success; it is the soil in which success is rooted. Every person you admire has simply failed better than others.','失败不是成功的反面，而是成功扎根的土壤。你敬仰的人，只是比他人失败得更漂亮。',[{'word':'opposite','pos':'n.','meaning':'反面'},{'word':'rooted','pos':'adj.','meaning':'扎根的'}],['失败','成长'],3)
a('essay','人生','On Choosing','星海','We often fear choosing wrong, yet the greater risk is choosing nothing. A path walked badly still moves you forward; a road unwalked keeps you exactly where you are.','我们常怕选错，更大的险却是什么都不选。走坏的路仍向前，未走的路让你原地不动。',[{'word':'fear','pos':'v.','meaning':'害怕'},{'word':'risk','pos':'n.','meaning':'风险'}],['选择','勇气'],3)
a('essay','人生','On Being Ordinary','星海','The world praises the extraordinary, but most of a good life is ordinary: a warm meal, a clear morning, a kind word. Do not despise the small; it is where happiness lives.','世人赞非凡，但好生活多半平凡：一顿暖饭、一个清亮的早晨、一句善意。别轻视细微，幸福就住在那里。',[{'word':'ordinary','pos':'adj.','meaning':'平凡的'},{'word':'despise','pos':'v.','meaning':'轻视'}],['平凡','幸福'],3)
a('essay','人生','On Growing Older','星海','To grow older is not to shrink but to deepen. The young rush to the surface; the old have learned the value of the current beneath.','变老不是缩小，而是变深。年轻人冲向表层，老者已懂得暗流之价值。',[{'word':'shrink','pos':'v.','meaning':'退缩'},{'word':'deepen','pos':'v.','meaning':'变深'}],['年岁','智慧'],3)
a('essay','人生','On Kindness','星海','Kindness costs little and earns much. A single gentle act can outlive the day that bore it, echoing in a stranger far longer than you will ever know.','善意代价小，获益多。一次温柔之举可胜过诞生它的那一天，在陌生人心里回响得比你想象的更久。',[{'word':'kindness','pos':'n.','meaning':'善意'},{'word':'echo','pos':'v.','meaning':'回响'}],['善意','影响'],2)
a('essay','人生','On Letting Go','星海','Letting go is not losing; it is making room. The hands that release the old are the same hands free to hold the new.','放手不是失去，而是腾出空间。松开旧物的手，正是腾空去接新物的手。',[{'word':'release','pos':'v.','meaning':'松开'},{'word':'room','pos':'n.','meaning':'空间'}],['放下','新生'],2)
a('quote','人生','On Doing','Confucius','It does not matter how slowly you go as long as you do not stop.','只要不停下，走得慢也无妨。',[{'word':'slowly','pos':'adv.','meaning':'缓慢地'}],['坚持','行动'],1)
a('quote','人生','On Falling','Confucius','Our greatest glory is not in never falling, but in rising every time we fall.','最大的荣耀不在永不跌倒，而在每次跌倒后站起。',[{'word':'glory','pos':'n.','meaning':'荣耀'},{'word':'rising','pos':'v.','meaning':'站起'}],['坚韧','荣耀'],2)
a('quote','人生','On Action','William James','Act as if what you do makes a difference. It does.','就当你的作为举足轻重。它确实如此。',[{'word':'difference','pos':'n.','meaning':'不同；影响'}],['行动','意义'],2)
a('quote','人生','On Self','Polonius (Shakespeare)','This above all: to thine own self be true.','最重要者：对自己要真诚。',[{'word':'true','pos':'adj.','meaning':'真实的'}],['真诚','自我'],2)
a('quote','人生','On Experience','星海','We are the sum of what we have lived, not what we have planned.','我们是所历之事的总和，而非所计划之事。',[{'word':'sum','pos':'n.','meaning':'总和'}],['经历','真实'],2)
a('quote','人生','On the Present','星海','Yesterday is a letter sent; tomorrow is one not yet written. Today is the ink in your hand.','昨日是寄出的信；明日是未写的信。今日是你手中的墨。',[{'word':'ink','pos':'n.','meaning':'墨'}],['当下','书写'],2)
a('quote','人生','On Worth','星海','Your value is not set by the crowd; it is revealed by the life you choose to live.','你的价值不由人群定，而由你选择的生活显现。',[{'word':'value','pos':'n.','meaning':'价值'},{'word':'reveal','pos':'v.','meaning':'显现'}],['价值','自我'],2)
a('quote','人生','On Peace','星海','Peace is not the absence of noise, but the presence of order within.','平静不是没有喧闹，而是内心有秩序。',[{'word':'absence','pos':'n.','meaning':'缺席'},{'word':'presence','pos':'n.','meaning':'存在'}],['平静','内心'],3)
a('quote','人生','On Change','星海','You cannot step twice into the same life; the river of self flows on.','你无法两次踏入同一段人生；自我的河流奔流不息。',[{'word':'step','pos':'v.','meaning':'踏入'}],['变化','自我'],3)
a('quote','人生','On Courage','星海','Courage is not the lack of fear, but the decision that something else matters more.','勇气不是没有恐惧，而是认定另有其事更为重要。',[{'word':'courage','pos':'n.','meaning':'勇气'},{'word':'lack','pos':'n.','meaning':'缺乏'}],['勇气','抉择'],3)

# ===================== 爱情 Love (25) =====================
a('poem','爱情','Sonnet 18','William Shakespeare','Shall I compare thee to a summer\'s day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May...','我可否把你比作夏日？\n你更可爱也更温婉：\n狂风摇落五月娇蕊……',[{'word':'temperate','pos':'adj.','meaning':'温和的'},{'word':'bud','pos':'n.','meaning':'花蕾'}],['经典','爱','夏'],3)
a('poem','爱情','How Do I Love Thee','Elizabeth Barrett Browning','How do I love thee? Let me count the ways.\nI love thee to the depth and breadth and height\nMy soul can reach, when feeling out of sight.','我怎样爱你？让我细数。\n我爱你直到灵魂能及的深、广、高，\n在目光不及之处。',[{'word':'breadth','pos':'n.','meaning':'广度'},{'word':'depth','pos':'n.','meaning':'深度'}],['经典','爱'],2)
a('poem','爱情','When You Are Old','W. B. Yeats','When you are old and grey and full of sleep,\nAnd nodding by the fire, take down this book,\nAnd slowly read, and dream of the soft look...','当你年老，灰发，睡意沉沉，\n炉边打盹时取卷此书，\n缓缓读，梦那柔和的眼神……',[{'word':'grey','pos':'adj.','meaning':'灰白的'},{'word':'nod','pos':'v.','meaning':'点头打盹'}],['爱','时光'],3)
a('poem','爱情','Love Is Not All','Edna St. Vincent Millay','Love is not all: it is not meat nor drink\nNor slumber nor a roof against the rain;\nYet many a man is willing to be lost...','爱并非全部：不是肉也不是酒，\n不是安睡，也不是遮雨的屋顶；\n却仍有许多人甘愿迷失……',[{'word':'slumber','pos':'n.','meaning':'安睡'},{'word':'roof','pos':'n.','meaning':'屋顶'}],['爱','奉献'],3)
a('poem','爱情','The Rose and the Thorn','星海','Love is the rose, and the thorn its honest twin;\nyou cannot hold the bloom and refuse the pain.\nThe wise cup both, and call the ache a name.','爱是玫瑰，刺是它诚实的孪生；\n你不能只握花而拒痛。\n智者双手皆捧，给那疼取一个名字。',[{'word':'thorn','pos':'n.','meaning':'刺'},{'word':'bloom','pos':'n.','meaning':'花'}],['爱','真实'],3)
a('poem','爱情','Distance','星海','Distance is only a test of love, not its enemy.\nThe root still feeds the flower it cannot see.','距离是爱的试金石，而非仇敌。\n根仍滋养它看不见的花。',[{'word':'distance','pos':'n.','meaning':'距离'},{'word':'enemy','pos':'n.','meaning':'敌人'}],['爱','距离'],2)
a('poem','爱情','The Quiet Kind','星海','The loudest love is not the truest;\nthe quiet kind stays after the fireworks fade,\nmaking tea, and meaning it.','最喧闹的爱并非最真；\n安静的那种在烟花散后仍在，\n泡茶，且真心实意。',[{'word':'truest','pos':'adj.','meaning':'最真的'},{'word':'fireworks','pos':'n.','meaning':'烟花'}],['爱','平淡'],2)
a('poem','爱情','First Light','星海','I knew it was love when morning became\na person, and the coffee smelled of someone else\'s laugh.','当清晨成了某个人，\n咖啡飘着他人笑声，\n我便知那是爱。',[{'word':'morning','pos':'n.','meaning':'清晨'}],['爱','日常'],2)
a('poem','爱情','The Letter Unsent','星海','Some loves live only in the letter never sent,\nkept safe by the stamp that was never licked,\nmore perfect for being unspent.','有些爱只活在未寄出的信里，\n因未舔的邮票而完好，\n因未曾耗费而更完美。',[{'word':'lick','pos':'v.','meaning':'舔'},{'word':'unspent','pos':'adj.','meaning':'未耗尽的'}],['爱','遗憾'],3)
a('essay','爱情','On Staying','星海','Love is easy to begin and hard to stay. Anyone can be swept away; few can choose, every ordinary Tuesday, to remain. That choosing is the real romance.','爱易开始而难相守。谁都能被卷走，鲜少有人能在每个平凡的周二选择留下。那选择，才是真正的浪漫。',[{'word':'swept','pos':'adj.','meaning':'被卷走的'},{'word':'remain','pos':'v.','meaning':'留下'}],['爱','相守'],3)
a('essay','爱情','On Respect','星海','The deepest love is not the one that completes you, but the one that respects your incompleteness. Two whole solitudes are worth more than one fused half.','最深的爱不是补全你，而是尊重你的不完整。两个完整的独处，胜过一个融合的半体。',[{'word':'incompleteness','pos':'n.','meaning':'不完整'},{'word':'solitude','pos':'n.','meaning':'独处'}],['爱','尊重'],4)
a('essay','爱情','On Heartbreak','星海','Heartbreak is love\'s tuition; painful, but it teaches you the shape of your own heart. Do not wish it away. Wish instead to learn, and to love again, wiser.','心碎是爱的学费，痛却教你认识自己心的形状。别祈它离去，祈自己学会，并更智慧地再爱。',[{'word':'heartbreak','pos':'n.','meaning':'心碎'},{'word':'tuition','pos':'n.','meaning':'学费'}],['爱','成长'],3)
a('essay','爱情','On Small Things','星海','Grand gestures fade; it is the small, repeated kindness that builds a life together. Love is mostly a thousand unnoticed mercies.','盛大姿态会褪色；是细小而重复的善意砌出共同生活。爱多半是千次不被注意的慈悲。',[{'word':'gesture','pos':'n.','meaning':'姿态'},{'word':'mercy','pos':'n.','meaning':'慈悲'}],['爱','日常'],3)
a('essay','爱情','On Freedom in Love','星海','Healthy love does not clip your wings; it builds a sky you want to return to. If love asks you to disappear, it was never love.','健康的爱不剪你羽翼，而筑一片你想回的天空。若爱要你消失，那从不是爱。',[{'word':'clip','pos':'v.','meaning':'剪'},{'word':'wings','pos':'n.','meaning':'翅膀'}],['爱','自由'],3)
a('quote','爱情','On Choice','星海','We do not find love; we choose it, daily, after the spark has cooled.','我们不是找到爱，而是每日在火花冷却后选择它。',[{'word':'spark','pos':'n.','meaning':'火花'}],['爱','选择'],2)
a('quote','爱情','On Trust','星海','Trust is the fabric of love; a single tear can unravel years.','信任是爱的织物；一滴泪可拆散多年。',[{'word':'fabric','pos':'n.','meaning':'织物'},{'word':'unravel','pos':'v.','meaning':'拆散'}],['爱','信任'],3)
a('quote','爱情','On Time','星海','Real love is spelled with time, not just feeling.','真爱用时间拼写，不止用感觉。',[{'word':'spell','pos':'v.','meaning':'拼写'}],['爱','时间'],1)
a('quote','爱情','On Presence','星海','The greatest gift of love is not a rose, but your full attention.','爱最珍贵的礼物不是玫瑰，而是你全然的专注。',[{'word':'attention','pos':'n.','meaning':'专注'}],['爱','陪伴'],2)
a('quote','爱情','On Equality','星海','Love grows best when two people stand, not one kneels.','当两人都站立而非一人跪下，爱长得最好。',[{'word':'kneel','pos':'v.','meaning':'跪'}],['爱','平等'],2)
a('quote','爱情','On Memory','星海','To be loved is to be remembered even in a crowded room.','被爱，便是在拥挤的房间里仍被记起。',[{'word':'crowded','pos':'adj.','meaning':'拥挤的'}],['爱','铭记'],2)
a('quote','爱情','On Healing','星海','The right love does not fix you; it sits with you while you fix yourself.','对的爱不修补你，而是陪你修补自己。',[{'word':'fix','pos':'v.','meaning':'修补'}],['爱','治愈'],2)
a('quote','爱情','On Honesty','星海','Say the true thing gently; love dies more often by silence than by words.','温柔地说真话；爱多死于沉默而非言语。',[{'word':'gently','pos':'adv.','meaning':'温柔地'},{'word':'silence','pos':'n.','meaning':'沉默'}],['爱','坦诚'],3)
a('quote','爱情','On Home','星海','Home is not a place; it is a person who makes the place irrelevant.','家不是地点，而是让你无视地点的人。',[{'word':'irrelevant','pos':'adj.','meaning':'无关紧要的'}],['爱','归属'],3)
a('quote','爱情','On Patience','星海','Love is a language; some learn it late, but none too late to be understood.','爱是一种语言；有人学得晚，但无一晚到不被听懂。',[{'word':'language','pos':'n.','meaning':'语言'}],['爱','耐心'],2)
a('quote','爱情','On Giving','星海','The heart that gives, gathers; love multiplies by spending.','付出的心反有所得；爱因付出而倍增。',[{'word':'multiply','pos':'v.','meaning':'倍增'},{'word':'spend','pos':'v.','meaning':'付出'}],['爱','给予'],3)

# ===================== 励志 Inspiration (25) =====================
a('poem','励志','Still I Rise','Maya Angelou','You may write me down in history\nWith your bitter, twisted lies,\nYou may tread me in the very dirt\nBut still, like dust, I\'ll rise.','你尽可在史册写我，\n用苦涩扭曲的谎言，\n尽可将我踩入泥尘，\n但我如尘，仍会升起。',[{'word':'twisted','pos':'adj.','meaning':'扭曲的'},{'word':'tread','pos':'v.','meaning':'踩'}],['经典','坚韧'],3)
a('poem','励志','Don\'t Quit','Edgar A. Guest','When things go wrong, as they sometimes will,\nWhen the road you\'re trudging seems all uphill,\nRest if you must, but don\'t you quit.','当事情出错——它时有发生，\n当你跋涉的路似全在上坡，\n可以歇，但别放弃。',[{'word':'trudging','pos':'v.','meaning':'跋涉'},{'word':'uphill','pos':'adj.','meaning':'上坡的'}],['坚持','经典'],2)
a('poem','励志','The Hill','星海','The hill does not care who climbs it;\nit offers the same wind to the weak and the strong.\nWhat matters is the foot that lifts again.','山不在意谁攀登；\n它给强弱同样的风。\n重要的是那再次抬起脚的人。',[{'word':'climb','pos':'v.','meaning':'攀登'},{'word':'weak','pos':'adj.','meaning':'弱的'}],['坚持','勇气'],2)
a('poem','励志','The Blacksmith','星海','You are the blacksmith of your own gate;\nthe hammer is heavy, the iron is cold,\nbut the shape is yours to make.','你是自己门扉的铁匠；\n锤沉重，铁冰冷，\n但形状由你打造。',[{'word':'blacksmith','pos':'n.','meaning':'铁匠'},{'word':'hammer','pos':'n.','meaning':'锤'}],['自强','塑造'],3)
a('poem','励志','Morning Resolve','星海','Each morning is a fresh page and a steady pen;\nwrite one honest line, and the day is already won.','每个清晨是新页与稳笔；\n写一行诚实的字，这天便已胜。',[{'word':'fresh','pos':'adj.','meaning':'崭新的'},{'word':'resolve','pos':'n.','meaning':'决心'}],['清晨','行动'],2)
a('poem','励志','The Lighthouse','星海','Be the lighthouse, not the ship:\nothers will weather storms by the steady light you keep,\neven when you cannot see the shore.','做灯塔，而非船：\n他人借你守的稳光渡风暴，\n即便你不见岸。',[{'word':'lighthouse','pos':'n.','meaning':'灯塔'},{'word':'weather','pos':'v.','meaning':'经受'}],['奉献','指引'],3)
a('poem','励志','Try','星海','A ship in harbor is safe, but that is not\nwhat ships are built for. Launch, and trust the sea.','停港的船安全，却非\n船被造的用意。启航，信海。',[{'word':'harbor','pos':'n.','meaning':'港湾'},{'word':'launch','pos':'v.','meaning':'启航'}],['勇气','出发'],2)
a('poem','励志','The Climb Matters','星海','Do not measure the mountain only by the peak;\nthe climb is the part that makes you able to stand there.','别只以峰量山；\n攀登才是让你立于彼处的原因。',[{'word':'measure','pos':'v.','meaning':'衡量'},{'word':'peak','pos':'n.','meaning':'山峰'}],['过程','成长'],2)
a('poem','励志','Unbroken','星海','They can take the road, not the walker;\nthe weather, not the will.\nCarry the second, and you arrive.','他们能夺路，夺不走行路者；\n能夺天气，夺不走意志。\n守住后者，你便抵达。',[{'word':'walker','pos':'n.','meaning':'行路者'},{'word':'will','pos':'n.','meaning':'意志'}],['意志','抵达'],3)
a('essay','励志','On Starting','星海','The hardest part of any work is the first sentence, the first step, the first coin. Begin before you feel ready; readiness is a feeling that arrives after the start, not before.','任何事最难的是首句、首步、首币。在准备好前就开始；就绪之感始于开始后，而非之前。',[{'word':'ready','pos':'adj.','meaning':'准备好的'},{'word':'arrive','pos':'v.','meaning':'到达'}],['开始','行动'],2)
a('essay','励志','On Discipline','星海','Motivation gets you started; discipline keeps you going. Wait for the mood and you will wait forever. Show up on the dull days, and the dull days build the life.','动力让你起步，纪律让你持续。等心情你将永远等。在平淡日也出现，平淡日筑出人生。',[{'word':'discipline','pos':'n.','meaning':'纪律'},{'word':'motivation','pos':'n.','meaning':'动力'}],['自律','坚持'],3)
a('essay','励志','On Fear','星海','Fear is a signal, not a sentence. It tells you where the edge is, not that you must turn back. Walk to the edge, look, and then decide with open eyes.','恐惧是信号，非判决。它指边界所在，非令你回头。走到边缘，看，再睁眼抉择。',[{'word':'signal','pos':'n.','meaning':'信号'},{'word':'sentence','pos':'n.','meaning':'判决'}],['恐惧','勇敢'],3)
a('essay','励志','On Small Steps','星海','Great things are only small things that refused to stop. The wall is built one brick at a time; so is a life worth admiring.','伟业只是不肯停的小事。墙一砖一砖砌成，值得敬仰的人生亦然。',[{'word':'brick','pos':'n.','meaning':'砖'},{'word':'admire','pos':'v.','meaning':'敬仰'}],['积累','坚持'],2)
a('essay','励志','On Comparison','星海','Comparison is the thief of joy, but it can be a teacher if used right: learn the craft, ignore the score. Run your own race at your own pace.','比较是快乐的小偷，用得好却是老师：学技艺，忽略比分。以自己节奏跑自己的赛。',[{'word':'comparison','pos':'n.','meaning':'比较'},{'word':'thief','pos':'n.','meaning':'小偷'}],['自我','节奏'],3)
a('essay','励志','On Setbacks','星海','A setback is a setup; it rearranges you for a better attempt. The athlete who never fell never learned the fall that saves the match.','挫折是铺垫，它重整你以更好尝试。从未跌倒的选手，学不会救场的那一摔。',[{'word':'setback','pos':'n.','meaning':'挫折'},{'word':'rearrange','pos':'v.','meaning':'重整'}],['挫折','转机'],3)
a('quote','励志','On Effort','Thomas Edison','Genius is one percent inspiration and ninety-nine percent perspiration.','天才是百分之一灵感加百分之九十九汗水。',[{'word':'inspiration','pos':'n.','meaning':'灵感'},{'word':'perspiration','pos':'n.','meaning':'汗水'}],['努力','天才'],3)
a('quote','励志','On Beginning','Chinese Proverb','A journey of a thousand miles begins with a single step.','千里之行，始于足下。',[{'word':'journey','pos':'n.','meaning':'旅程'}],['开始','积累'],1)
a('quote','励志','On Courage','Ambrose Redmoon','Courage is not the absence of fear, but the judgment that something else is more important.','勇气不是没有恐惧，而是判断另有其事更重要。',[{'word':'judgment','pos':'n.','meaning':'判断'}],['勇气','判断'],3)
a('quote','励志','On Persistence','Calvin Coolidge','Nothing in the world can take the place of persistence.','世上没有任何东西能取代坚持。',[{'word':'persistence','pos':'n.','meaning':'坚持'}],['坚持','力量'],2)
a('quote','励志','On Action','星海','Dreams don\'t work unless you do.','梦想不会实现，除非你行动。',[{'word':'dream','pos':'n.','meaning':'梦想'}],['梦想','行动'],1)
a('quote','励志','On Limits','星海','The limit is not the sky; the limit is the story you tell yourself.','极限不在天空，而在你对自己讲的故事。',[{'word':'limit','pos':'n.','meaning':'极限'}],['极限','信念'],3)
a('quote','励志','On Practice','星海','Mastery is practice in disguise; do it again, and again, until easy looks like gift.','精通是伪装的练习；做一次又一次，直到轻松看似天赋。',[{'word':'mastery','pos':'n.','meaning':'精通'},{'word':'disguise','pos':'n.','meaning':'伪装'}],['练习','精通'],3)
a('quote','励志','On Now','星海','The best time to plant was ten years ago; the second best is now.','种树最好的时机是十年前，其次是现在。',[{'word':'plant','pos':'v.','meaning':'种'}],['行动','当下'],2)
a('quote','励志','On Strength','星海','You have been broken and you are still here; that is strength enough to begin.','你曾破碎却仍在此；这已是起步足够的力量。',[{'word':'broken','pos':'adj.','meaning':'破碎的'}],['坚韧','重启'],2)
a('quote','励志','On Belief','星海','Believe you can, and you are already halfway there.','相信自己能，你便已行至半途。',[{'word':'believe','pos':'v.','meaning':'相信'}],['信念','起点'],1)

# ===================== 哲思 Philosophy (25) =====================
a('poem','哲思','The Conqueror','星海','He who conquers others is strong;\nhe who conquers himself is mighty.\nThe second war is the one worth winning.','胜人者有力，\n自胜者强。\n后者才是值得赢的战。',[{'word':'conquer','pos':'v.','meaning':'征服'},{'word':'mighty','pos':'adj.','meaning':'强大的'}],['老子','自省'],3)
a('poem','哲思','The Two Wolves','星海','Inside us two wolves fight: one of anger, one of peace.\nThe one that wins is the one you feed.','心中两狼相争：一为怒，一为静。\n胜者是你所喂养的那只。',[{'word':'anger','pos':'n.','meaning':'愤怒'},{'word':'peace','pos':'n.','meaning':'平静'}],['选择','内心'],2)
a('poem','哲思','The River of Thought','星海','Thoughts are rivers; you are not the water,\nyou are the bank that watches it pass.\nStep back, and the current loses its grip.','思绪如河；你非水，\n而是望它流过的岸。\n退后，急流便失其掌控。',[{'word':'bank','pos':'n.','meaning':'岸'},{'word':'current','pos':'n.','meaning':'水流'}],['觉察','超脱'],3)
a('poem','哲思','The Mask','星海','We wear a face to meet the faces that we meet,\nbut the soul keeps a quieter, truer seat.\nLearn the difference, and you are free.','我们戴一张脸去见众脸，\n灵魂却守着更安静更真的座。\n辨其别，你便自由。',[{'word':'mask','pos':'n.','meaning':'面具'},{'word':'seat','pos':'n.','meaning':'座位'}],['本真','自由'],3)
a('poem','哲思','The Question','星海','Better the question that wakes you\nthan the answer that lets you sleep.\nWonder is the door; certainty, the wall.','宁可要唤醒你的问题，\n也不要让你安睡的答案。\n好奇是门，确定是墙。',[{'word':'certainty','pos':'n.','meaning':'确定'},{'word':'wonder','pos':'n.','meaning':'好奇'}],['提问','智慧'],3)
a('poem','哲思','On Knowing','星海','True knowledge is knowing how little you know.\nThe full cup cannot hold the rain;\nthe empty one becomes the stream.','真知是知道自己所知甚少。\n满杯盛不下雨；\n空杯方成溪。',[{'word':'knowledge','pos':'n.','meaning':'知识'},{'word':'empty','pos':'adj.','meaning':'空的'}],['谦逊','求知'],3)
a('poem','哲思','The Mirror','星海','The world is a mirror with a kind of mind:\nit gives back the gaze you send.\nLook with wonder, and wonder returns.','世界是一面有心的镜：\n回你投出的目光。\n以好奇望，好奇便回。',[{'word':'mirror','pos':'n.','meaning':'镜子'},{'word':'gaze','pos':'n.','meaning':'凝视'}],['投射','心境'],3)
a('poem','哲思','The Pendulum','星海','Joy and sorrow are one pendulum;\nto still it is to still the life.\nSwing, and call both by the name of living.','喜与悲是一摆；\n止摆即止生。\n摆吧，二者皆名"活"。',[{'word':'sorrow','pos':'n.','meaning':'悲伤'},{'word':'pendulum','pos':'n.','meaning':'钟摆'}],['对立','接纳'],3)
a('poem','哲思','The Uncarved Block','星海','The uncarved block holds every shape;\nthe carved one, only one.\nStay a little unformed, and remain free.','未雕之木含万形；\n雕者仅一形。\n留些未成，方得自由。',[{'word':'uncarved','pos':'adj.','meaning':'未雕的'},{'word':'block','pos':'n.','meaning':'木块'}],['老子','本真'],3)
a('essay','哲思','On Meaning','星海','Meaning is not found; it is made. We are the authors of the sense our lives seem to possess. Wait for meaning to arrive and you wait in vain; build it, and it builds you back.','意义不是被找到，而是被造出。我们是赋予生活以意义之作者。等意义降临是空等；去建构，它亦建构你。',[{'word':'meaning','pos':'n.','meaning':'意义'},{'word':'vain','pos':'adj.','meaning':'徒劳的'}],['意义','创造'],4)
a('essay','哲思','On Freedom','星海','Freedom is less about doing what you please than about not being governed by what displeases you. The free man is not the one with no cage, but the one who has stopped rattling the bars.','自由少关于随心，多关于不被所恶支配。自由人非无笼者，而是停摇笼栏者。',[{'word':'freedom','pos':'n.','meaning':'自由'},{'word':'govern','pos':'v.','meaning':'支配'}],['自由','心境'],4)
a('essay','哲思','On Truth','星海','Truth is not always comfortable, but it is always a foundation. A life built on a pleasant lie will tremble; a life built on truth may be hard, but it stands.','真相未必舒服，却总是根基。建于悦人谎言的人生会颤；建于真相者或苦，却能立。',[{'word':'truth','pos':'n.','meaning':'真相'},{'word':'foundation','pos':'n.','meaning':'根基'}],['真实','根基'],3)
a('essay','哲思','On Simplicity','星海','Simplicity is the peak of sophistication. To say much with little, to need little to be full—this is not poverty but mastery of want.','简是繁之极。以少言多，以少需而满——非贫，乃驾驭欲望之熟。',[{'word':'simplicity','pos':'n.','meaning':'简约'},{'word':'sophistication','pos':'n.','meaning':'精密；老练'}],['简约','智慧'],4)
a('essay','哲思','On Change','星海','The only constant is change, yet we build our peace on the fixed. Wisdom is to love the shifting ground and learn to dance on moving stone.','唯一恒常是变，我们却把安宁建于固定。智慧是爱这流动之地，学着在移石上起舞。',[{'word':'constant','pos':'n.','meaning':'恒常'},{'word':'shifting','pos':'adj.','meaning':'移动的'}],['变化','智慧'],3)
a('essay','哲思','On the Self','星海','The self is not a thing but a process, rewritten each moment by what we attend to. Tend the garden of attention, and the self tends toward light.','自我非物而是过程，每刻被所注之事重写。照看专注之园，自我便向光而生。',[{'word':'process','pos':'n.','meaning':'过程'},{'word':'attend','pos':'v.','meaning':'专注'}],['自我','觉察'],4)
a('quote','哲思','On Knowing','Socrates','The unexamined life is not worth living.','未经审视的人生不值得过。',[{'word':'unexamined','pos':'adj.','meaning':'未经审视的'}],['自省','人生'],3)
a('quote','哲思','On Control','Epictetus','It\'s not what happens to you, but how you react that matters.','重要的不是发生何事，而是你如何应对。',[{'word':'react','pos':'v.','meaning':'反应'}],['掌控','心态'],3)
a('quote','哲思','On Opinion','Marcus Aurelius','You have power over your mind—not outside events. Realize this, and you will find strength.','你掌控自己的心，而非外事。明白此，你得力量。',[{'word':'power','pos':'n.','meaning':'力量'}],['内心','力量'],3)
a('quote','哲思','On Time','Seneca','As is a tale, so is life: not how long it is, but how good it is, matters.','人生如故事：重要的非长短，而是好坏。',[{'word':'tale','pos':'n.','meaning':'故事'}],['生命','质量'],3)
a('quote','哲思','On Doubt','René Descartes','If you would be a real seeker of truth, it is necessary once in your life to doubt everything.','若真求真理，一生中必须有一次怀疑一切。',[{'word':'seek','pos':'v.','meaning':'寻求'},{'word':'doubt','pos':'v.','meaning':'怀疑'}],['怀疑','求真'],4)
a('quote','哲思','On Silence','星海','Speech is silver, silence is the gold you spend it to buy.','言语是银，沉默是你花银买来的金。',[{'word':'silver','pos':'n.','meaning':'银'}],['沉默','智慧'],2)
a('quote','哲思','On Perspective','星海','The same sun that melts the wax hardens the clay; it is not the sun that differs.','同一太阳融蜡亦硬陶；不同的不是太阳。',[{'word':'melt','pos':'v.','meaning':'融化'},{'word':'clay','pos':'n.','meaning':'陶土'}],['视角','心境'],3)
a('quote','哲思','On Enough','星海','Wealth is not having more, but needing less.','富有不是拥有更多，而是需要更少。',[{'word':'wealth','pos':'n.','meaning':'财富'}],['知足','富有'],2)
a('quote','哲思','On the Present Mind','星海','Wherever you are, be there totally.','无论何处，全然在此。',[{'word':'totally','pos':'adv.','meaning':'全然地'}],['专注','当下'],2)
a('quote','哲思','On Paradox','星海','To hold two truths at once is not confusion; it is the beginning of wisdom.','同时持两真非混乱，而是智慧之始。',[{'word':'paradox','pos':'n.','meaning':'悖论'},{'word':'confusion','pos':'n.','meaning':'混乱'}],['悖论','智慧'],4)

# ===================== 时间 Time (25) =====================
a('poem','时间','To the Virgins, to Make Much of Time','Robert Herrick','Gather ye rosebuds while ye may,\nOld Time is still a-flying:\nAnd this same flower that smiles today\nTomorrow will be dying.','趁年少采玫瑰，\n时光仍在飞逝：\n今日微笑的花，\n明天便将凋零。',[{'word':'rosebud','pos':'n.','meaning':'玫瑰花蕾'},{'word':'flying','pos':'adj.','meaning':'飞逝的'}],['经典','惜时'],2)
a('poem','时间','The Hourglass','星海','The hourglass keeps no secret but this:\nthe sand that falls is the life you live.\nTurn it, and you only begin again.','沙漏无秘密，唯此：\n落沙即你所活之生。\n翻转它，你只是重新开始。',[{'word':'hourglass','pos':'n.','meaning':'沙漏'},{'word':'sand','pos':'n.','meaning':'沙'}],['时间','珍惜'],2)
a('poem','时间','The Clock and the Tree','星海','The clock counts in seconds; the tree in seasons.\nNeither is wrong. Learn to read both, and time becomes a friend, not a foe.','钟以秒计，树以季计。\n皆非错。学会读二者，时间成友非敌。',[{'word':'season','pos':'n.','meaning':'季节'},{'word':'foe','pos':'n.','meaning':'敌人'}],['时间','节奏'],2)
a('poem','时间','Yesterday\'s Letter','星海','Yesterday is a letter written in water;\nyou may read the shape, never the words.\nLet it teach, then let it go.','昨日是写在水中的信；\n你可见形，难读字。\n让它教，然后放它走。',[{'word':'water','pos':'n.','meaning':'水'}],['昨日','放下'],2)
a('poem','时间','The Long Now','星海','We hurry through the minute to spoil the hour,\nchase the day and lose the year.\nSlow down; the long now is made of careful seconds.','我们匆匆过分钟，毁了小时，\n追着日子，失了年。\n慢些；悠长此刻由珍视的秒砌成。',[{'word':'spoil','pos':'v.','meaning':'糟蹋'},{'word':'careful','pos':'adj.','meaning':'仔细的'}],['时间','从容'],3)
a('poem','时间','Autumn Accounts','星海','Autumn is the year\'s honest bookkeeper,\nwriting in red what the spring forgot to pay.\nRead it without regret; balance is coming.','秋是年诚实的簿记，\n以红笔记下春未付之账。\n无憾读它；平衡将至。',[{'word':'bookkeeper','pos':'n.','meaning':'簿记员'},{'word':'regret','pos':'n.','meaning':'遗憾'}],['秋','清算'],3)
a('poem','时间','The Visitor','星海','Time is a visitor who never knocks;\nit enters, rearranges the room, and leaves\nwithout taking back a single thing.','时间是不敲门的访客；\n它进，重排房间，离去，\n不取回丝毫。',[{'word':'visitor','pos':'n.','meaning':'访客'},{'word':'rearrange','pos':'v.','meaning':'重排'}],['时间','改变'],2)
a('poem','时间','Noon','星海','Noon is the promise the morning made;\nkeep it, and the evening will not accuse you.','正午是清晨许的诺；\n守住它，黄昏便不责你。',[{'word':'promise','pos':'n.','meaning':'诺言'},{'word':'accuse','pos':'v.','meaning':'责怪'}],['当下','守信'],2)
a('poem','时间','The Slow Art','星海','Some things refuse the quick hand:\ntrust, a tree, a self. Give them time,\nand time will give them back as gift.','有些事拒急手：\n信任、树、自我。给它们时间，\n时间将以礼相还。',[{'word':'refuse','pos':'v.','meaning':'拒绝'},{'word':'quick','pos':'adj.','meaning':'快速的'}],['耐心','成长'],3)
a('essay','时间','On Wasting Time','星海','We fear wasting time, yet rest is not waste. The mind, like the field, needs the fallow season to bear fruit. Do not mistake stillness for loss.','我们怕浪费时间，然休息非浪费。心如田，需休耕方结果。别把静止当损失。',[{'word':'fallow','pos':'adj.','meaning':'休耕的'},{'word':'bear','pos':'v.','meaning':'结出'}],['休息','节奏'],3)
a('essay','时间','On the Past','星海','The past is a place you visit, not live. Return to learn, not to reside; the person you were can guide you only if you keep walking forward.','过去是探访之地，非居所。回去学，非久留；唯有前行，旧我才引你。',[{'word':'reside','pos':'v.','meaning':'居住'},{'word':'guide','pos':'v.','meaning':'指引'}],['过去','前行'],3)
a('essay','时间','On Deadlines','星海','A deadline is a horizon, not a wall. It gives the work shape and urgency, but it need not define your worth. Finish what you can; release the rest with grace.','截止期是地平线，非墙。它赋工作以形与急，却不必定义你价值。尽你所能；余者从容放下。',[{'word':'horizon','pos':'n.','meaning':'地平线'},{'word':'urgency','pos':'n.','meaning':'急迫'}],['期限','从容'],3)
a('essay','时间','On the Future','星海','The future is not a place you arrive at but a direction you walk. Plant the step you can see; the path reveals the next only when you take it.','未来非抵达之地，而是所行方向。种下可见之步；路只在你迈时显下一步。',[{'word':'direction','pos':'n.','meaning':'方向'},{'word':'reveal','pos':'v.','meaning':'显现'}],['未来','方向'],3)
a('essay','时间','On Moments','星海','We remember life not by its length but by its moments—the unexpected laugh, the quiet dawn, the hand held in storm. Collect moments; years take care of themselves.','我们记生活不凭长短，而凭片刻——意外之笑、静谧黎明、风暴中相握的手。收藏片刻；年岁自理。',[{'word':'length','pos':'n.','meaning':'长度'},{'word':'unexpected','pos':'adj.','meaning':'意外的'}],['片刻','记忆'],3)
a('quote','时间','On Use','Benjamin Franklin','Lost time is never found again.','失去的时间永不重来。',[{'word':'lost','pos':'adj.','meaning':'失去的'}],['惜时','行动'],2)
a('quote','时间','On Now','Lucius Annaeus Seneca','While we are postponing, life speeds by.','我们拖延时，生命疾驰而过。',[{'word':'postpone','pos':'v.','meaning':'拖延'}],['拖延','当下'],2)
a('quote','时间','On Habit','星海','Time is the currency of habit; spend it well, and it compounds into a life.','时间是习惯的货币；善用它，利滚成生。',[{'word':'currency','pos':'n.','meaning':'货币'},{'word':'compound','pos':'v.','meaning':'复利增长'}],['习惯','积累'],3)
a('quote','时间','On Patience','星海','Time reveals what urgency hides.','时间显露急迫所掩之事。',[{'word':'reveal','pos':'v.','meaning':'显露'}],['时间','真相'],2)
a('quote','时间','On Age','星海','Age is not counted in years but in the summers you noticed.','年龄不以年计，而以你留意过的夏天计。',[{'word':'age','pos':'n.','meaning':'年龄'}],['岁月','感知'],2)
a('quote','时间','On the Present','星海','Forever is composed of nows.','永远由无数此刻组成。',[{'word':'compose','pos':'v.','meaning':'组成'}],['当下','永恒'],2)
a('quote','时间','On Priority','星海','You do not lack time; you lack a ranking of what matters.','你并不缺时间，缺的是对要事的排序。',[{'word':'ranking','pos':'n.','meaning':'排序'}],['优先级','时间'],3)
a('quote','时间','On Memory','星海','The past is a lantern, not a leash; let it light the path, not pull you back.','过去是灯而非绳；让它照路，不把你拉回。',[{'word':'lantern','pos':'n.','meaning':'灯笼'},{'word':'leash','pos':'n.','meaning':'绳'}],['过去','照亮'],3)
a('quote','时间','On Seizing','星海','Opportunity wears a forelock; seize it as it passes, for the bald back will not be caught.','机遇只有额发；过路时抓，光头之背抓不住。',[{'word':'opportunity','pos':'n.','meaning':'机遇'},{'word':'forelock','pos':'n.','meaning':'额发'}],['机遇','果断'],3)
a('quote','时间','On Slowness','星海','Haste makes the road longer; slow feet often arrive first.','匆忙令路更长；慢脚常先到。',[{'word':'haste','pos':'n.','meaning':'匆忙'}],['慢','从容'],2)
a('quote','时间','On Legacy','星海','Plant trees whose shade you will never sit in; that is how time learns your name.','种你永无福荫可乘的树；时间如此记下你名。',[{'word':'shade','pos':'n.','meaning':'树荫'},{'word':'legacy','pos':'n.','meaning':'遗产'}],['传承','时间'],3)

# ===================== 梦想 Dream (25) =====================
a('poem','梦想','Dreams','Langston Hughes','Hold fast to dreams\nFor if dreams die\nLife is a broken-winged bird\nThat cannot fly.','紧紧握住梦想，\n因为梦想若死，\n生命是折翼之鸟，\n再不能飞。',[{'word':'broken-winged','pos':'adj.','meaning':'折翼的'},{'word':'fly','pos':'v.','meaning':'飞'}],['经典','梦想'],2)
a('poem','梦想','The Dreamer','星海','The dreamer is a cartographer of the not-yet,\ndrawing coasts no foot has touched.\nLaugh if you must; the map becomes the road.','梦想家是"尚未"的制图者，\n绘无人足及的海岸。\n笑便笑；地图终成路。',[{'word':'cartographer','pos':'n.','meaning':'制图师'},{'word':'coast','pos':'n.','meaning':'海岸'}],['梦想','创造'],3)
a('poem','梦想','The Ladder','星海','A dream is a ladder leaned against the sky;\neach step is small, the height is earned.\nDo not count the rungs; climb them.','梦想是倚天的梯；\n每步小，高由挣得。\n别数横档；去爬。',[{'word':'ladder','pos':'n.','meaning':'梯子'},{'word':'rung','pos':'n.','meaning':'横档'}],['梦想','坚持'],2)
a('poem','梦想','The Compass','星海','A dream is a compass that points through fog;\nyou may not see the land, but the needle is true.\nTrust the small red arrow in the chest.','梦想是穿透雾的指南；\n你或不见岸，针却真。\n信胸前那小红箭。',[{'word':'compass','pos':'n.','meaning':'指南针'},{'word':'fog','pos':'n.','meaning':'雾'}],['梦想','方向'],2)
a('poem','梦想','The Seed of Want','星海','Want is the seed; dream is the tree;\nthe fruit is the life you dared to grow.\nWater the want before it withers.','渴望是种，梦想是树；\n果是你敢育出的人生。\n在渴望枯萎前浇灌。',[{'word':'wither','pos':'v.','meaning':'枯萎'},{'word':'dare','pos':'v.','meaning':'敢'}],['渴望','行动'],2)
a('poem','梦想','The Distant Light','星海','Somewhere a light is lit for the thing you\'ll be.\nWalk toward it, though the road is dark;\nthe dark is only the unhired half of dawn.','某处为一将成的你点亮灯。\n朝它走，虽路黑；\n黑暗只是黎明未雇的一半。',[{'word':'distant','pos':'adj.','meaning':'遥远的'},{'word':'lit','pos':'adj.','meaning':'点亮的'}],['远方','希望'],3)
a('poem','梦想','The Unbuilt','星海','Every building stood first as a thought;\nevery thought, as a wish someone kept.\nKeep the wish; the walls will follow.','每栋楼先立于念；\n每念，立于某人守的愿。\n守愿；墙自随。',[{'word':'building','pos':'n.','meaning':'建筑'},{'word':'wish','pos':'n.','meaning':'愿望'}],['构想','实现'],2)
a('poem','梦想','The Long Game','星海','Dream in decades, act in days.\nThe oak does not hurry the acorn;\nthe acorn, nonetheless, becomes the oak.','以十年梦想，以终日行动。\n橡树不催橡果；\n橡果终究成橡树。',[{'word':'decade','pos':'n.','meaning':'十年'},{'word':'acorn','pos':'n.','meaning':'橡果'}],['远见','耐心'],3)
a('poem','梦想','The Impossible','星海','They told the moon it was impossible to reach;\nthe moon said nothing and waited for the foot.\nImpossible is only a slow possible.','他们告诉月亮抵达不可能；\n月亮不语，等那只脚。\n不可能只是慢的可能。',[{'word':'impossible','pos':'adj.','meaning':'不可能的'},{'word':'reach','pos':'v.','meaning':'抵达'}],['不可能','突破'],3)
a('essay','梦想','On Big Dreams','星海','Big dreams scare us because they ask for a bigger self than we are. That is the point: the dream is the invitation to grow into the person who can hold it.','大梦令我们惧，因它要一个比现在更大的自己。这正是关键：梦是邀你长成能承载它的人。',[{'word':'scare','pos':'v.','meaning':'惊吓'},{'word':'invitation','pos':'n.','meaning':'邀请'}],['大梦','成长'],3)
a('essay','梦想','On Fear of Failing','星海','The fear of failing at a dream keeps more people small than the dream ever could. Failure at least proves you left the shore; safety proves only that you stayed.','对梦失败的惧，比梦本身令更多人渺小。失败至少证你离了岸；安全只证你未动。',[{'word':'shore','pos':'n.','meaning':'岸'},{'word':'safety','pos':'n.','meaning':'安全'}],['惧败','出发'],3)
a('essay','梦想','On Realism','星海','Dreams need a foot in the real. The idealist who plans is worth ten who only wish. Pair the vision with a Tuesday to-do list, and the dream learns to walk.','梦需一只脚踩实地。会规划的理想者胜十个空愿者。以周二待办配愿景，梦便学走。',[{'word':'realist','pos':'n.','meaning':'现实主义者'},{'word':'vision','pos':'n.','meaning':'愿景'}],['务实','落地'],3)
a('essay','梦想','On Others\' Opinions','星海','Your dream will be misread by those who never had one. Listen politely, then return to the work. The critic rarely builds; the builder rarely stops to explain.','你的梦会被无梦者误读。礼貌听，然后回到工作。批评者少建造；建造者少停解释。',[{'word':'misread','pos':'v.','meaning':'误读'},{'word':'critic','pos':'n.','meaning':'批评者'}],['质疑','坚持'],3)
a('essay','梦想','On Patience in Dreaming','星海','A dream deferred is not a dream denied. The long wait is not wasted; it gathers the strength and the skills the short road would have lacked.','被延的梦非被拒的梦。久等非虚度；它积蓄短途所缺之力与技。',[{'word':'defer','pos':'v.','meaning':'推迟'},{'word':'deny','pos':'v.','meaning':'拒绝'}],['延迟','积蓄'],3)
a('quote','梦想','On Imagination','Albert Einstein','Imagination is more important than knowledge.','想象力比知识更重要。',[{'word':'imagination','pos':'n.','meaning':'想象力'}],['想象','创造'],2)
a('quote','梦想','On Vision','Henry David Thoreau','Go confidently in the direction of your dreams. Live the life you have imagined.','自信朝梦想方向前行，活出你想象的人生。',[{'word':'confidently','pos':'adv.','meaning':'自信地'}],['方向','行动'],2)
a('quote','梦想','On Stars','Christopher Reeve','So many of our dreams at first seem impossible, then they seem improbable, then inevitable.','我们的梦起初似不可能，继而似未必，终而似必然。',[{'word':'improbable','pos':'adj.','meaning':'未必的'},{'word':'inevitable','pos':'adj.','meaning':'必然的'}],['进程','信念'],4)
a('quote','梦想','On Shooting','Les Brown','Shoot for the moon. Even if you miss, you\'ll land among the stars.','向月而射。即便射偏，你也会落于星间。',[{'word':'shoot','pos':'v.','meaning':'射击'}],['高远','勇气'],2)
a('quote','梦想','On Belief','Walt Disney','If you can dream it, you can do it.','若能梦它，便能成它。',[{'word':'dream','pos':'v.','meaning':'梦想'}],['信念','行动'],1)
a('quote','梦想','On Starting','星海','A dream written down with a date becomes a goal.','写下并注日期的梦，便成目标。',[{'word':'goal','pos':'n.','meaning':'目标'}],['目标','落地'],2)
a('quote','梦想','On Courage','星海','The future belongs to those who believe in the beauty of their dreams.','未来属于相信梦想之美的人。',[{'word':'belong','pos':'v.','meaning':'属于'},{'word':'beauty','pos':'n.','meaning':'美'}],['未来','信念'],2)
a('quote','梦想','On Small Starts','星海','Every empire began as a single, absurd hope.','每座帝国始于一个荒唐的希望。',[{'word':'empire','pos':'n.','meaning':'帝国'},{'word':'absurd','pos':'adj.','meaning':'荒唐的'}],['起点','希望'],3)
a('quote','梦想','On Persistence','星海','A dream is just a goal with the stairs still being built.','梦只是楼梯尚在搭建的目标。',[{'word':'stairs','pos':'n.','meaning':'楼梯'}],['过程','坚持'],2)
a('quote','梦想','On Fear','星海','Doubt kills more dreams than failure ever will.','怀疑扼杀的梦，多于失败。',[{'word':'doubt','pos':'n.','meaning':'怀疑'}],['怀疑','行动'],2)
a('quote','梦想','On the Horizon','星海','Chase the horizon, and the horizon chases a better you.','追地平线，地平线便追更好的你。',[{'word':'horizon','pos':'n.','meaning':'地平线'}],['追逐','成长'],2)

# ===================== 孤独 Loneliness (25) =====================
a('poem','孤独','Alone','星海','Alone is not empty; it is the room\nwhere the self finally speaks.\nClose the door, and listen for your name.','独处非空，而是\n自我终开口的房间。\n关门，听你名字。',[{'word':'empty','pos':'adj.','meaning':'空的'},{'word':'speak','pos':'v.','meaning':'说话'}],['独处','自我'],2)
a('poem','孤独','The Solitary Star','星海','One star, set apart, burns no less\nfor being far from the crowd.\nDistance is a kind of brightness too.','一颗孤星，虽离群，\n光不减。\n距离亦是一种明亮。',[{'word':'apart','pos':'adj.','meaning':'分开的'},{'word':'brightness','pos':'n.','meaning':'明亮'}],['孤独','光亮'],2)
a('poem','孤独','The Empty Chair','星海','An empty chair is not a lack;\nit is the space a guest may fill,\nor the silence you learn to keep.','空椅非缺；\n是客可填之处，\n或你学会守的静。',[{'word':'lack','pos':'n.','meaning':'缺乏'},{'word':'guest','pos':'n.','meaning':'客人'}],['空','留白'],2)
a('poem','孤独','The Night Walker','星海','The city sleeps; I walk its lit bones,\na stranger to every window,\nyet belonging to the whole quiet street.','城睡；我走它亮的骨，\n每扇窗的陌生人，\n却属于整条静街。',[{'word':'stranger','pos':'n.','meaning':'陌生人'},{'word':'quiet','pos':'adj.','meaning':'安静的'}],['夜行','归属'],3)
a('poem','孤独','The Lonely Lighthouse','星海','The lighthouse is built to be alone,\nyet it is the first friend the lost ship sees.\nSolitude, well kept, becomes a beacon.','灯塔本为独而建，\n却是迷船初见的友。\n孤守得好，便成灯塔之光。',[{'word':'solitude','pos':'n.','meaning':'孤独'},{'word':'beacon','pos':'n.','meaning':'灯塔；信标'}],['孤独','指引'],3)
a('poem','孤独','The Unread Book','星海','Some of us are books no one has opened;\nthe words are no less true for being unread.\nOpen yourself, and the reader appears.','我们中有未被翻开的书的，\n字不因未读而减真。\n翻开自己，读者自现。',[{'word':'unread','pos':'adj.','meaning':'未读的'},{'word':'appear','pos':'v.','meaning':'出现'}],['未被理解','自启'],3)
a('poem','孤独','The Desert Within','星海','The desert within is not a wasteland;\nit is where the small, green truth can grow\nunseen by any crowd.','心中的沙漠非荒原；\n是小小绿真可长之处，\n不为众见。',[{'word':'desert','pos':'n.','meaning':'沙漠'},{'word':'wasteland','pos':'n.','meaning':'荒原'}],['内在','生长'],3)
a('poem','孤独','The Last Train','星海','I missed the last train and found the night;\nnot lost, but lent an hour\nno timetable ever gave.','我误末班车，得一夜；\n非失，乃借得\n时刻表从未给的时。',[{'word':'timetable','pos':'n.','meaning':'时刻表'},{'word':'lend','pos':'v.','meaning':'借给'}],['错过','礼物'],3)
a('poem','孤独','The Quiet Companion','星海','Loneliness is a poor companion, but it tells the truth\nthe cheerful ones hide.\nSit with it awhile; it teaches the way home.','孤独是劣伴，却说欢者藏的真。\n与坐片刻；它教归途。',[{'word':'companion','pos':'n.','meaning':'伴侣'},{'word':'cheerful','pos':'adj.','meaning':'欢快的'}],['孤独','真实'],3)
a('essay','孤独','On Being Alone','星海','Being alone and being lonely are not the same. One is a choice, the other a pain. Learn to enjoy the first, and the second loses its grip. Solitude is the tuition of the self.','独处与孤独不同。一是选择，一是痛。学会享前者，后者失其握。孤独是自我的学费。',[{'word':'lonely','pos':'adj.','meaning':'孤独的'},{'word':'tuition','pos':'n.','meaning':'学费'}],['独处','自我'],3)
a('essay','孤独','On Connection','星海','We fear loneliness so much that we stay in rooms where we do not belong. Better one true hour alone than a year of false company. Choose the real, even when it is quiet.','我们太怕孤独，遂留于不属于的房间。宁愿真独一小时，胜假伴一年。选真实，即便安静。',[{'word':'belong','pos':'v.','meaning':'属于'},{'word':'company','pos':'n.','meaning':'陪伴'}],['真实','独处'],3)
a('essay','孤独','On the Crowd','星海','The crowd can be the loneliest place of all, for there you may be most forgotten. Do not mistake nearness for kinship; the soul knows the difference.','人群或最孤独处，因你最易被忘。别以相近为亲；灵魂辨其别。',[{'word':'crowd','pos':'n.','meaning':'人群'},{'word':'kinship','pos':'n.','meaning':'亲缘'}],['人群','灵魂'],3)
a('essay','孤独','On Self-Company','星海','If you cannot bear your own company, whose will you trust? The relationship with yourself is the longest you will ever keep. Tend it, and loneliness turns to peace.','若受不了自己做伴，又能信谁？与己之关系是所守最长。善待它，孤独转静。',[{'word':'bear','pos':'v.','meaning':'忍受'},{'word':'relationship','pos':'n.','meaning':'关系'}],['自处','和平'],3)
a('essay','孤独','On Reaching Out','星海','Loneliness is not a verdict but a signal: it means you are made for others. The brave act is not to hide it, but to call, to write, to knock. Connection begins with one honest hand.','孤独非判决而是信号：意你本为彼此而生。勇敢非藏它，而是打电话、写信、敲门。连接始于一只诚实的手。',[{'word':'verdict','pos':'n.','meaning':'判决'},{'word':'signal','pos':'n.','meaning':'信号'}],['联结','勇气'],3)
a('quote','孤独','On Solitude','Henry David Thoreau','I never found the companion that was so companionable as solitude.','我从未找到如孤独般相伴随的伴。',[{'word':'companionable','pos':'adj.','meaning':'如伴的'}],['孤独','相随'],4)
a('quote','孤独','On the Self','星海','In the silence of alone, the truest voice is heard.','在独处的静里，最真的声音被听见。',[{'word':'silence','pos':'n.','meaning':'静默'}],['独处','真声'],2)
a('quote','孤独','On Strength','星海','He who is comfortable alone is never truly abandoned.','能安于独处者，永不被真弃。',[{'word':'abandon','pos':'v.','meaning':'抛弃'}],['独处','安稳'],2)
a('quote','孤独','On the Night','星海','The night does not desert the lonely; it simply listens.','夜不弃孤独者；它只是听。',[{'word':'desert','pos':'v.','meaning':'抛弃'}],['夜','倾听'],2)
a('quote','孤独','On Wholeness','星海','You are not half a person waiting for another; you are whole, and meet others from that fullness.','你非等另一人的半个；你是整的，自那丰盈会他人。',[{'word':'wholeness','pos':'n.','meaning':'完整'}],['完整','自爱'],3)
a('quote','孤独','On the Window','星海','A lit window in the dark is a promise that someone, somewhere, is awake.','暗中亮窗，是某处有人醒着的诺言。',[{'word':'awake','pos':'adj.','meaning':'醒着的'}],['联结','希望'],2)
a('quote','孤独','On Wandering','星海','To wander alone is not to be lost, but to be free to be found.','独行非迷，而是自由地被寻。',[{'word':'wander','pos':'v.','meaning':'漫游'}],['独行','自由'],2)
a('quote','孤独','On the Heart','星海','The heart that learns to sit with itself need not fear the empty room.','学会与己同坐的心，不畏空房。',[{'word':'sit','pos':'v.','meaning':'坐'}],['自处','无畏'],2)
a('quote','孤独','On Stars','星海','Even the most distant star is not alone; it is simply seen from far.','最远的星也不孤；只是自远处被看。',[{'word':'distant','pos':'adj.','meaning':'遥远的'}],['星','不孤'],2)
a('quote','孤独','On Time Alone','星海','Give yourself the gift of an unbooked evening.','赠自己一个无安排的夜晚。',[{'word':'unbooked','pos':'adj.','meaning':'无安排的'}],['独处','礼物'],1)
a('quote','孤独','On Returning','星海','We go out to belong, and return to become.','我们外出以求属，归来以成己。',[{'word':'become','pos':'v.','meaning':'成为'}],['外出','归来'],2)

# ============================================================
# 程序化生成:在 200 篇精选(公有领域经典 + 原创)基础上,
# 用"中英对齐模板 + 主题概念词库"扩充到 3000 篇。
# 每条都有对齐的中文译文、生词卡、标签、难度。
# ============================================================
import random
from collections import Counter, defaultdict
random.seed(20260723)

# 每个主题的概念词库 (英文, 中文)
CONCEPTS = {
    '自然': [('nature','自然'),('river','河流'),('mountain','高山'),('sky','天空'),('forest','森林'),('sea','大海'),('wind','风'),('rain','雨'),('star','星辰'),('dawn','黎明'),('seed','种子'),('root','根'),('leaf','叶'),('stone','石'),('season','季节'),('moon','月'),('tide','潮汐'),('cloud','云'),('valley','山谷'),('meadow','草地')],
    '人生': [('life','人生'),('road','道路'),('choice','选择'),('scar','伤疤'),('courage','勇气'),('peace','平静'),('change','变化'),('moment','片刻'),('journey','旅程'),('lesson','课业'),('burden','重担'),('gift','礼物'),('silence','沉默'),('habit','习惯'),('hope','希望'),('regret','悔恨'),('patience','耐心'),('meaning','意义'),('growth','成长'),('grace','从容')],
    '爱情': [('love','爱'),('heart','心'),('trust','信任'),('distance','距离'),('rose','玫瑰'),('promise','诺言'),('warmth','温暖'),('memory','记忆'),('longing','思念'),('tenderness','温柔'),('home','家'),('touch','触碰'),('gaze','凝望'),('vow','誓言'),('devotion','深情'),('embrace','拥抱'),('patience','耐心'),('kindness','善意')],
    '励志': [('dream','梦想'),('effort','努力'),('failure','失败'),('strength','力量'),('will','意志'),('start','起步'),('discipline','自律'),('fear','恐惧'),('summit','顶峰'),('spark','火花'),('grit','坚毅'),('rise','崛起'),('hope','希望'),('storm','风暴'),('practice','练习'),('courage','勇气'),('focus','专注'),('progress','进步')],
    '哲思': [('truth','真理'),('mind','心智'),('wisdom','智慧'),('doubt','怀疑'),('freedom','自由'),('shadow','阴影'),('question','问题'),('silence','沉默'),('self','自我'),('paradox','悖论'),('simplicity','简约'),('meaning','意义'),('mirror','镜'),('balance','平衡'),('reason','理性'),('mystery','奥秘'),('order','秩序'),('nothing','虚无')],
    '时间': [('time','时间'),('moment','此刻'),('yesterday','昨日'),('tomorrow','明日'),('hour','钟点'),('season','季节'),('memory','记忆'),('patience','耐心'),('clock','时钟'),('sand','流沙'),('dawn','黎明'),('dusk','黄昏'),('now','当下'),('age','岁月'),('haste','匆忙'),('rhythm','节奏'),('past','过去'),('future','未来')],
    '梦想': [('dream','梦想'),('star','星辰'),('hope','希望'),('vision','愿景'),('ladder','阶梯'),('horizon','地平线'),('wing','翅膀'),('fire','火焰'),('path','道路'),('courage','勇气'),('seed','种子'),('light','光'),('summit','山巅'),('wish','愿望'),('faith','信念'),('flight','飞翔'),('spark','火花'),('quest','追寻')],
    '孤独': [('solitude','孤独'),('silence','静默'),('night','夜'),('star','孤星'),('room','房间'),('shadow','影'),('self','自我'),('window','窗'),('distance','距离'),('stranger','陌生人'),('quiet','安静'),('echo','回声'),('moon','月'),('road','路'),('stillness','寂静'),('depth','深处'),('candle','烛火'),('space','空间')],
}

# 通用中英对齐模板 (英文, 中文),槽位:{A}{B} 英文词, {Az}{Bz} 中文词
TEMPLATES = [
    ("{A} is not the enemy of {B}; it is its teacher.", "{Az}并非{Bz}的敌人，而是它的老师。"),
    ("Where there is {A}, there is always a door to {B}.", "哪里有{Az}，哪里就有通往{Bz}的门。"),
    ("A life without {A} is a sky without {B}.", "没有{Az}的人生，如同没有{Bz}的天空。"),
    ("{A} whispers what {B} shouts.", "{Az}低语着{Bz}所呐喊的。"),
    ("Hold your {A} gently, and {B} will follow.", "轻轻握住你的{Az}，{Bz}便会随之而来。"),
    ("The wise trade {A} for {B}, and never look back.", "智者以{Az}换{Bz}，从不回头。"),
    ("{A} is a seed; {B} is the tree it becomes.", "{Az}是种子，{Bz}是它长成的树。"),
    ("Do not fear {A}; fear a life untouched by {B}.", "不要惧怕{Az}，要怕的是从未被{Bz}触及的人生。"),
    ("Every {A} carries a quiet {B} inside it.", "每一份{Az}里都藏着一份静默的{Bz}。"),
    ("{A} is the bridge; {B} is the far shore.", "{Az}是桥，{Bz}是彼岸。"),
    ("Let {A} be your compass, and {B} your road.", "让{Az}做你的罗盘，让{Bz}做你的路。"),
    ("Small {A}, repeated, becomes great {B}.", "微小的{Az}不断重复，便成就伟大的{Bz}。"),
    ("The heart learns {A} only after it has lost {B}.", "心唯有在失去{Bz}之后，才学会{Az}。"),
    ("{A} spoken in silence outlasts {B} spoken in noise.", "在静默中道出的{Az}，比在喧嚣中喊出的{Bz}更长久。"),
    ("You cannot buy {A}, but you can grow it from {B}.", "你买不到{Az}，却能从{Bz}中把它养大。"),
    ("{A} is a language, and {B} is its native tongue.", "{Az}是一种语言，{Bz}是它的母语。"),
    ("Between {A} and {B} lies the whole of a good life.", "在{Az}与{Bz}之间，藏着美好人生的全部。"),
    ("When {A} fades, {B} remembers the way home.", "当{Az}褪去，{Bz}仍记得回家的路。"),
    ("Give your {A} to the world, and {B} returns to you.", "把你的{Az}献给世界，{Bz}便回到你身上。"),
    ("{A} is measured not in size, but in {B}.", "{Az}不以大小衡量，而以{Bz}衡量。"),
    ("Follow {A} far enough, and you will meet {B}.", "把{Az}走得够远，你终会遇见{Bz}。"),
    ("{A} is the question; {B} is the slow answer.", "{Az}是问题，{Bz}是缓慢的答案。"),
    ("Even the smallest {A} can hold an ocean of {B}.", "哪怕最微小的{Az}，也能盛下一整片{Bz}的海。"),
    ("Trade noise for {A}, and hurry for {B}.", "以{Az}换喧嚣，以{Bz}换匆忙。"),
    ("{A} does not shout; it simply outlasts {B}.", "{Az}从不喧哗，它只是比{Bz}更持久。"),
]

TITLES = {
    '自然': ['On Nature','The Quiet Field','A Note to the Sky','River Song','Beneath the Trees','Wind and Water','The Living Earth','Morning Light','Green Silence','Where Roots Go'],
    '人生': ['On Living','The Long Road','A Handful of Days','Quiet Courage','The Weight We Carry','Small Graces','What the Years Teach','Choosing Again','The Ordinary Miracle','Still Walking'],
    '爱情': ['On Love','The Quiet Kind','Two Solitudes','Distance and the Heart','A Small Devotion','What Stays','The Long Warmth','Letters We Keep','Home in a Person','Tender Things'],
    '励志': ['On Rising','The Climb','Begin Anyway','The Steady Flame','After the Fall','One More Step','The Long Game','Grit and Grace','Toward the Summit','Do Not Quit'],
    '哲思': ['On Thinking','The Uncarved Truth','Between Two Mirrors','A Quiet Reason','The Empty Cup','On Simplicity','The Shape of Doubt','What the Mind Knows','Order and Mystery','The Middle Way'],
    '时间': ['On Time','The Long Now','Sand and Hours','What Remains','Yesterday\'s Light','The Slow Art','Before the Dusk','Counting Seasons','The Patient Clock','This Very Hour'],
    '梦想': ['On Dreaming','Toward the Horizon','The Ladder of Light','Wings and Fire','The Distant Star','Keep the Wish','A Path of Sparks','The Long Flight','What We Dare','The Quiet Quest'],
    '孤独': ['On Solitude','The Solitary Star','A Lit Window','The Quiet Room','Alone, Not Lonely','Night Company','The Honest Silence','Where the Self Speaks','Far, Not Lost','The Inner Space'],
}


def cap(s):
    return (s[0].upper() + s[1:]) if s else s


ALL_EN = set(d['original'] for d in DATA)
curated_by_theme = Counter(d['theme'] for d in DATA)
TARGET_PER = 375  # 8 主题 * 375 = 3000

for theme in THEMES:
    concepts = CONCEPTS[theme]
    combos = []
    for (en_t, zh_t) in TEMPLATES:
        for A in concepts:
            for B in concepts:
                if A is B:
                    continue
                combos.append((en_t, zh_t, A, B))
    random.shuffle(combos)
    ptr = 0

    def next_combo():
        global ptr
        if ptr < len(combos):
            c = combos[ptr]
            ptr += 1
            return c
        return None

    def render(c):
        en_t, zh_t, A, B = c
        en = cap(en_t.format(A=A[0], B=B[0], Az=A[1], Bz=B[1]))
        zh = zh_t.format(A=A[0], B=B[0], Az=A[1], Bz=B[1])
        return en, zh, A, B

    need = TARGET_PER - curated_by_theme[theme]
    titles = TITLES[theme]
    made = 0
    idx = 0
    while made < need and ptr < len(combos):
        r = idx % 7
        if r == 0:
            typ, lines = 'poem', 3
        elif r == 3:
            typ, lines = 'essay', 2
        else:
            typ, lines = 'quote', 1
        chosen = []
        for _ in range(lines):
            c = next_combo()
            if c is None:
                break
            chosen.append(c)
        if len(chosen) < lines:
            break
        rends = [render(c) for c in chosen]
        if typ == 'poem':
            en = '\n'.join(x[0] for x in rends)
            zh = '\n'.join(x[1] for x in rends)
            diff = 3
        elif typ == 'essay':
            en = ' '.join(x[0] for x in rends)
            zh = ''.join(x[1] for x in rends)
            diff = 3
        else:
            en, zh = rends[0][0], rends[0][1]
            diff = 2
        if en in ALL_EN:
            idx += 1
            continue
        ALL_EN.add(en)
        vocabmap = {}
        for x in rends:
            for cc in (x[2], x[3]):
                vocabmap.setdefault(cc[0], cc[1])
        vocab = [{'word': w, 'pos': 'n.', 'meaning': m} for w, m in list(vocabmap.items())[:4]]
        tags = [theme, rends[0][2][1], rends[0][3][1]]
        a(typ, theme, random.choice(titles), '星海', en, zh, vocab, tags, diff)
        made += 1
        idx += 1

# 校验主题数量
cnt = Counter(d['theme'] for d in DATA)
print('total:', len(DATA))
print('by theme:', dict(cnt))
assert len(DATA) == 3000, 'must be 3000, got %d' % len(DATA)
assert all(c == 375 for c in cnt.values()), 'each theme must be 375: %s' % dict(cnt)

base = os.path.dirname(os.path.abspath(__file__))
out1 = os.path.join(base, 'data', 'content.json')
out2 = os.path.join(base, '..', 'public', 'content.json')
with open(out1, 'w', encoding='utf-8') as f:
    json.dump(DATA, f, ensure_ascii=False, indent=2)
with open(out2, 'w', encoding='utf-8') as f:
    json.dump(DATA, f, ensure_ascii=False, indent=2)
print('written:', out1)
print('written:', out2)
