// This file describes mappings from Unicode codepoints to the keysym values
// (and optionally, key names) expected by the RFB protocol
// How this file was generated:
// node /Users/jalf/dev/mi/novnc/utils/parse.js /opt/X11/include/X11/keysymdef.h
var keysyms = (function(){
    "use strict";
    var keynames = null;
    var codepoints = {"32":32,"33":33,"34":34,"35":35,"36":36,"37":37,"38":38,"39":39,"40":40,"41":41,"42":42,"43":43,"44":44,"45":45,"46":46,"47":47,"48":48,"49":49,"50":50,"51":51,"52":52,"53":53,"54":54,"55":55,"56":56,"57":57,"58":58,"59":59,"60":60,"61":61,"62":62,"63":63,"64":64,"65":65,"66":66,"67":67,"68":68,"69":69,"70":70,"71":71,"72":72,"73":73,"74":74,"75":75,"76":76,"77":77,"78":78,"79":79,"80":80,"81":81,"82":82,"83":83,"84":84,"85":85,"86":86,"87":87,"88":88,"89":89,"90":90,"91":91,"92":92,"93":93,"94":94,"95":95,"96":96,"97":97,"98":98,"99":99,"100":100,"101":101,"102":102,"103":103,"104":104,"105":105,"106":106,"107":107,"108":108,"109":109,"110":110,"111":111,"112":112,"113":113,"114":114,"115":115,"116":116,"117":117,"118":118,"119":119,"120":120,"121":121,"122":122,"123":123,"124":124,"125":125,"126":126,"160":160,"161":161,"162":162,"163":163,"164":164,"165":165,"166":166,"167":167,"168":168,"169":169,"170":170,"171":171,"172":172,"173":173,"174":174,"175":175,"176":176,"177":177,"178":178,"179":179,"180":180,"181":181,"182":182,"183":183,"184":184,"185":185,"186":186,"187":187,"188":188,"189":189,"190":190,"191":191,"192":192,"193":193,"194":194,"195":195,"196":196,"197":197,"198":198,"199":199,"200":200,"201":201,"202":202,"203":203,"204":204,"205":205,"206":206,"207":207,"208":208,"209":209,"210":210,"211":211,"212":212,"213":213,"214":214,"215":215,"216":216,"217":217,"218":218,"219":219,"220":220,"221":221,"222":222,"223":223,"224":224,"225":225,"226":226,"227":227,"228":228,"229":229,"230":230,"231":231,"232":232,"233":233,"234":234,"235":235,"236":236,"237":237,"238":238,"239":239,"240":240,"241":241,"242":242,"243":243,"244":244,"245":245,"246":246,"247":247,"248":248,"249":249,"250":250,"251":251,"252":252,"253":253,"254":254,"255":255,"256":960,"257":992,"258":451,"259":483,"260":417,"261":433,"262":454,"263":486,"264":710,"265":742,"266":709,"267":741,"268":456,"269":488,"270":463,"271":495,"272":464,"273":496,"274":938,"275":954,"278":972,"279":1004,"280":458,"281":490,"282":460,"283":492,"284":728,"285":760,"286":683,"287":699,"288":725,"289":757,"290":939,"291":955,"292":678,"293":694,"294":673,"295":689,"296":933,"297":949,"298":975,"299":1007,"300":16777516,"301":16777517,"302":967,"303":999,"304":681,"305":697,"308":684,"309":700,"310":979,"311":1011,"312":930,"313":453,"314":485,"315":934,"316":950,"317":421,"318":437,"321":419,"322":435,"323":465,"324":497,"325":977,"326":1009,"327":466,"328":498,"330":957,"331":959,"332":978,"333":1010,"336":469,"337":501,"338":5052,"339":5053,"340":448,"341":480,"342":931,"343":947,"344":472,"345":504,"346":422,"347":438,"348":734,"349":766,"350":426,"351":442,"352":425,"353":441,"354":478,"355":510,"356":427,"357":443,"358":940,"359":956,"360":989,"361":1021,"362":990,"363":1022,"364":733,"365":765,"366":473,"367":505,"368":475,"369":507,"370":985,"371":1017,"372":16777588,"373":16777589,"374":16777590,"375":16777591,"376":5054,"377":428,"378":444,"379":431,"380":447,"381":430,"382":446,"399":16777615,"402":2294,"415":16777631,"416":16777632,"417":16777633,"431":16777647,"432":16777648,"437":16777653,"438":16777654,"439":16777655,"466":16777681,"486":16777702,"487":16777703,"601":16777817,"629":16777845,"658":16777874,"711":439,"728":418,"729":511,"731":434,"733":445,"901":1966,"902":1953,"904":1954,"905":1955,"906":1956,"908":1959,"910":1960,"911":1963,"912":1974,"913":1985,"914":1986,"915":1987,"916":1988,"917":1989,"918":1990,"919":1991,"920":1992,"921":1993,"922":1994,"923":1995,"924":1996,"925":1997,"926":1998,"927":1999,"928":2000,"929":2001,"931":2002,"932":2004,"933":2005,"934":2006,"935":2007,"936":2008,"937":2009,"938":1957,"939":1961,"940":1969,"941":1970,"942":1971,"943":1972,"944":1978,"945":2017,"946":2018,"947":2019,"948":2020,"949":2021,"950":2022,"951":2023,"952":2024,"953":2025,"954":2026,"955":2027,"956":2028,"957":2029,"958":2030,"959":2031,"960":2032,"961":2033,"962":2035,"963":2034,"964":2036,"965":2037,"966":2038,"967":2039,"968":2040,"969":2041,"970":1973,"971":1977,"972":1975,"973":1976,"974":1979,"1025":1715,"1026":1713,"1027":1714,"1028":1716,"1029":1717,"1030":1718,"1031":1719,"1032":1720,"1033":1721,"1034":1722,"1035":1723,"1036":1724,"1038":1726,"1039":1727,"1040":1761,"1041":1762,"1042":1783,"1043":1767,"1044":1764,"1045":1765,"1046":1782,"1047":1786,"1048":1769,"1049":1770,"1050":1771,"1051":1772,"1052":1773,"1053":1774,"1054":1775,"1055":1776,"1056":1778,"1057":1779,"1058":1780,"1059":1781,"1060":1766,"1061":1768,"1062":1763,"1063":1790,"1064":1787,"1065":1789,"1066":1791,"1067":1785,"1068":1784,"1069":1788,"1070":1760,"1071":1777,"1072":1729,"1073":1730,"1074":1751,"1075":1735,"1076":1732,"1077":1733,"1078":1750,"1079":1754,"1080":1737,"1081":1738,"1082":1739,"1083":1740,"1084":1741,"1085":1742,"1086":1743,"1087":1744,"1088":1746,"1089":1747,"1090":1748,"1091":1749,"1092":1734,"1093":1736,"1094":1731,"1095":1758,"1096":1755,"1097":1757,"1098":1759,"1099":1753,"1100":1752,"1101":1756,"1102":1728,"1103":1745,"1105":1699,"1106":1697,"1107":1698,"1108":1700,"1109":1701,"1110":1702,"1111":1703,"1112":1704,"1113":1705,"1114":1706,"1115":1707,"1116":1708,"1118":1710,"1119":1711,"1168":1725,"1169":1709,"1170":16778386,"1171":16778387,"1174":16778390,"1175":16778391,"1178":16778394,"1179":16778395,"1180":16778396,"1181":16778397,"1186":16778402,"1187":16778403,"1198":16778414,"1199":16778415,"1200":16778416,"1201":16778417,"1202":16778418,"1203":16778419,"1206":16778422,"1207":16778423,"1208":16778424,"1209":16778425,"1210":16778426,"1211":16778427,"1240":16778456,"1241":16778457,"1250":16778466,"1251":16778467,"1256":16778472,"1257":16778473,"1262":16778478,"1263":16778479,"1329":16778545,"1330":16778546,"1331":16778547,"1332":16778548,"1333":16778549,"1334":16778550,"1335":16778551,"1336":16778552,"1337":16778553,"1338":16778554,"1339":16778555,"1340":16778556,"1341":16778557,"1342":16778558,"1343":16778559,"1344":16778560,"1345":16778561,"1346":16778562,"1347":16778563,"1348":16778564,"1349":16778565,"1350":16778566,"1351":16778567,"1352":16778568,"1353":16778569,"1354":16778570,"1355":16778571,"1356":16778572,"1357":16778573,"1358":16778574,"1359":16778575,"1360":16778576,"1361":16778577,"1362":16778578,"1363":16778579,"1364":16778580,"1365":16778581,"1366":16778582,"1370":16778586,"1371":16778587,"1372":16778588,"1373":16778589,"1374":16778590,"1377":16778593,"1378":16778594,"1379":16778595,"1380":16778596,"1381":16778597,"1382":16778598,"1383":16778599,"1384":16778600,"1385":16778601,"1386":16778602,"1387":16778603,"1388":16778604,"1389":16778605,"1390":16778606,"1391":16778607,"1392":16778608,"1393":16778609,"1394":16778610,"1395":16778611,"1396":16778612,"1397":16778613,"1398":16778614,"1399":16778615,"1400":16778616,"1401":16778617,"1402":16778618,"1403":16778619,"1404":16778620,"1405":16778621,"1406":16778622,"1407":16778623,"1408":16778624,"1409":16778625,"1410":16778626,"1411":16778627,"1412":16778628,"1413":16778629,"1414":16778630,"1415":16778631,"1417":16778633,"1418":16778634,"1488":3296,"1489":3297,"1490":3298,"1491":3299,"1492":3300,"1493":3301,"1494":3302,"1495":3303,"1496":3304,"1497":3305,"1498":3306,"1499":3307,"1500":3308,"1501":3309,"1502":3310,"1503":3311,"1504":3312,"1505":3313,"1506":3314,"1507":3315,"1508":3316,"1509":3317,"1510":3318,"1511":3319,"1512":3320,"1513":3321,"1514":3322,"1548":1452,"1563":1467,"1567":1471,"1569":1473,"1570":1474,"1571":1475,"1572":1476,"1573":1477,"1574":1478,"1575":1479,"1576":1480,"1577":1481,"1578":1482,"1579":1483,"1580":1484,"1581":1485,"1582":1486,"1583":1487,"1584":1488,"1585":1489,"1586":1490,"1587":1491,"1588":1492,"1589":1493,"1590":1494,"1591":1495,"1592":1496,"1593":1497,"1594":1498,"1600":1504,"1601":1505,"1602":1506,"1603":1507,"1604":1508,"1605":1509,"1606":1510,"1607":1511,"1608":1512,"1609":1513,"1610":1514,"1611":1515,"1612":1516,"1613":1517,"1614":1518,"1615":1519,"1616":1520,"1617":1521,"1618":1522,"1619":16778835,"1620":16778836,"1621":16778837,"1632":16778848,"1633":16778849,"1634":16778850,"1635":16778851,"1636":16778852,"1637":16778853,"1638":16778854,"1639":16778855,"1640":16778856,"1641":16778857,"1642":16778858,"1648":16778864,"1657":16778873,"1662":16778878,"1670":16778886,"1672":16778888,"1681":16778897,"1688":16778904,"1700":16778916,"1705":16778921,"1711":16778927,"1722":16778938,"1726":16778942,"1729":16778945,"1740":16778956,"1746":16778962,"1748":16778964,"1776":16778992,"1777":16778993,"1778":16778994,"1779":16778995,"1780":16778996,"1781":16778997,"1782":16778998,"1783":16778999,"1784":16779000,"1785":16779001,"3458":16780674,"3459":16780675,"3461":16780677,"3462":16780678,"3463":16780679,"3464":16780680,"3465":16780681,"3466":16780682,"3467":16780683,"3468":16780684,"3469":16780685,"3470":16780686,"3471":16780687,"3472":16780688,"3473":16780689,"3474":16780690,"3475":16780691,"3476":16780692,"3477":16780693,"3478":16780694,"3482":16780698,"3483":16780699,"3484":16780700,"3485":16780701,"3486":16780702,"3487":16780703,"3488":16780704,"3489":16780705,"3490":16780706,"3491":16780707,"3492":16780708,"3493":16780709,"3494":16780710,"3495":16780711,"3496":16780712,"3497":16780713,"3498":16780714,"3499":16780715,"3500":16780716,"3501":16780717,"3502":16780718,"3503":16780719,"3504":16780720,"3505":16780721,"3507":16780723,"3508":16780724,"3509":16780725,"3510":16780726,"3511":16780727,"3512":16780728,"3513":16780729,"3514":16780730,"3515":16780731,"3517":16780733,"3520":16780736,"3521":16780737,"3522":16780738,"3523":16780739,"3524":16780740,"3525":16780741,"3526":16780742,"3530":16780746,"3535":16780751,"3536":16780752,"3537":16780753,"3538":16780754,"3539":16780755,"3540":16780756,"3542":16780758,"3544":16780760,"3545":16780761,"3546":16780762,"3547":16780763,"3548":16780764,"3549":16780765,"3550":16780766,"3551":16780767,"3570":16780786,"3571":16780787,"3572":16780788,"3585":3489,"3586":3490,"3587":3491,"3588":3492,"3589":3493,"3590":3494,"3591":3495,"3592":3496,"3593":3497,"3594":3498,"3595":3499,"3596":3500,"3597":3501,"3598":3502,"3599":3503,"3600":3504,"3601":3505,"3602":3506,"3603":3507,"3604":3508,"3605":3509,"3606":3510,"3607":3511,"3608":3512,"3609":3513,"3610":3514,"3611":3515,"3612":3516,"3613":3517,"3614":3518,"3615":3519,"3616":3520,"3617":3521,"3618":3522,"3619":3523,"3620":3524,"3621":3525,"3622":3526,"3623":3527,"3624":3528,"3625":3529,"3626":3530,"3627":3531,"3628":3532,"3629":3533,"3630":3534,"3631":3535,"3632":3536,"3633":3537,"3634":3538,"3635":3539,"3636":3540,"3637":3541,"3638":3542,"3639":3543,"3640":3544,"3641":3545,"3642":3546,"3647":3551,"3648":3552,"3649":3553,"3650":3554,"3651":3555,"3652":3556,"3653":3557,"3654":3558,"3655":3559,"3656":3560,"3657":3561,"3658":3562,"3659":3563,"3660":3564,"3661":3565,"3664":3568,"3665":3569,"3666":3570,"3667":3571,"3668":3572,"3669":3573,"3670":3574,"3671":3575,"3672":3576,"3673":3577,"4304":16781520,"4305":16781521,"4306":16781522,"4307":16781523,"4308":16781524,"4309":16781525,"4310":16781526,"4311":16781527,"4312":16781528,"4313":16781529,"4314":16781530,"4315":16781531,"4316":16781532,"4317":16781533,"4318":16781534,"4319":16781535,"4320":16781536,"4321":16781537,"4322":16781538,"4323":16781539,"4324":16781540,"4325":16781541,"4326":16781542,"4327":16781543,"4328":16781544,"4329":16781545,"4330":16781546,"4331":16781547,"4332":16781548,"4333":16781549,"4334":16781550,"4335":16781551,"4336":16781552,"4337":16781553,"4338":16781554,"4339":16781555,"4340":16781556,"4341":16781557,"4342":16781558,"7682":16784898,"7683":16784899,"7690":16784906,"7691":16784907,"7710":16784926,"7711":16784927,"7734":16784950,"7735":16784951,"7744":16784960,"7745":16784961,"7766":16784982,"7767":16784983,"7776":16784992,"7777":16784993,"7786":16785002,"7787":16785003,"7808":16785024,"7809":16785025,"7810":16785026,"7811":16785027,"7812":16785028,"7813":16785029,"7818":16785034,"7819":16785035,"7840":16785056,"7841":16785057,"7842":16785058,"7843":16785059,"7844":16785060,"7845":16785061,"7846":16785062,"7847":16785063,"7848":16785064,"7849":16785065,"7850":16785066,"7851":16785067,"7852":16785068,"7853":16785069,"7854":16785070,"7855":16785071,"7856":16785072,"7857":16785073,"7858":16785074,"7859":16785075,"7860":16785076,"7861":16785077,"7862":16785078,"7863":16785079,"7864":16785080,"7865":16785081,"7866":16785082,"7867":16785083,"7868":16785084,"7869":16785085,"7870":16785086,"7871":16785087,"7872":16785088,"7873":16785089,"7874":16785090,"7875":16785091,"7876":16785092,"7877":16785093,"7878":16785094,"7879":16785095,"7880":16785096,"7881":16785097,"7882":16785098,"7883":16785099,"7884":16785100,"7885":16785101,"7886":16785102,"7887":16785103,"7888":16785104,"7889":16785105,"7890":16785106,"7891":16785107,"7892":16785108,"7893":16785109,"7894":16785110,"7895":16785111,"7896":16785112,"7897":16785113,"7898":16785114,"7899":16785115,"7900":16785116,"7901":16785117,"7902":16785118,"7903":16785119,"7904":16785120,"7905":16785121,"7906":16785122,"7907":16785123,"7908":16785124,"7909":16785125,"7910":16785126,"7911":16785127,"7912":16785128,"7913":16785129,"7914":16785130,"7915":16785131,"7916":16785132,"7917":16785133,"7918":16785134,"7919":16785135,"7920":16785136,"7921":16785137,"7922":16785138,"7923":16785139,"7924":16785140,"7925":16785141,"7926":16785142,"7927":16785143,"7928":16785144,"7929":16785145,"8194":2722,"8195":2721,"8196":2723,"8197":2724,"8199":2725,"8200":2726,"8201":2727,"8202":2728,"8210":2747,"8211":2730,"8212":2729,"8213":1967,"8215":3295,"8216":2768,"8217":2769,"8218":2813,"8220":2770,"8221":2771,"8222":2814,"8224":2801,"8225":2802,"8226":2790,"8229":2735,"8230":2734,"8240":2773,"8242":2774,"8243":2775,"8248":2812,"8254":1150,"8304":16785520,"8308":16785524,"8309":16785525,"8310":16785526,"8311":16785527,"8312":16785528,"8313":16785529,"8320":16785536,"8321":16785537,"8322":16785538,"8323":16785539,"8324":16785540,"8325":16785541,"8326":16785542,"8327":16785543,"8328":16785544,"8329":16785545,"8352":16785568,"8353":16785569,"8354":16785570,"8355":16785571,"8356":16785572,"8357":16785573,"8358":16785574,"8359":16785575,"8360":16785576,"8361":3839,"8362":16785578,"8363":16785579,"8364":8364,"8453":2744,"8470":1712,"8471":2811,"8478":2772,"8482":2761,"8531":2736,"8532":2737,"8533":2738,"8534":2739,"8535":2740,"8536":2741,"8537":2742,"8538":2743,"8539":2755,"8540":2756,"8541":2757,"8542":2758,"8592":2299,"8593":2300,"8594":2301,"8595":2302,"8658":2254,"8660":2253,"8706":2287,"8709":16785925,"8711":2245,"8712":16785928,"8713":16785929,"8715":16785931,"8728":3018,"8730":2262,"8731":16785947,"8732":16785948,"8733":2241,"8734":2242,"8743":2270,"8744":2271,"8745":2268,"8746":2269,"8747":2239,"8748":16785964,"8749":16785965,"8756":2240,"8757":16785973,"8764":2248,"8771":2249,"8773":16785992,"8775":16785991,"8800":2237,"8801":2255,"8802":16786018,"8803":16786019,"8804":2236,"8805":2238,"8834":2266,"8835":2267,"8866":3068,"8867":3036,"8868":3010,"8869":3022,"8968":3027,"8970":3012,"8981":2810,"8992":2212,"8993":2213,"9109":3020,"9115":2219,"9117":2220,"9118":2221,"9120":2222,"9121":2215,"9123":2216,"9124":2217,"9126":2218,"9128":2223,"9132":2224,"9143":2209,"9146":2543,"9147":2544,"9148":2546,"9149":2547,"9225":2530,"9226":2533,"9227":2537,"9228":2531,"9229":2532,"9251":2732,"9252":2536,"9472":2211,"9474":2214,"9484":2210,"9488":2539,"9492":2541,"9496":2538,"9500":2548,"9508":2549,"9516":2551,"9524":2550,"9532":2542,"9618":2529,"9642":2791,"9643":2785,"9644":2779,"9645":2786,"9646":2783,"9647":2767,"9650":2792,"9651":2787,"9654":2781,"9655":2765,"9660":2793,"9661":2788,"9664":2780,"9665":2764,"9670":2528,"9675":2766,"9679":2782,"9702":2784,"9734":2789,"9742":2809,"9747":2762,"9756":2794,"9758":2795,"9792":2808,"9794":2807,"9827":2796,"9829":2798,"9830":2797,"9837":2806,"9839":2805,"10003":2803,"10007":2804,"10013":2777,"10016":2800,"10216":2748,"10217":2750,"10240":16787456,"10241":16787457,"10242":16787458,"10243":16787459,"10244":16787460,"10245":16787461,"10246":16787462,"10247":16787463,"10248":16787464,"10249":16787465,"10250":16787466,"10251":16787467,"10252":16787468,"10253":16787469,"10254":16787470,"10255":16787471,"10256":16787472,"10257":16787473,"10258":16787474,"10259":16787475,"10260":16787476,"10261":16787477,"10262":16787478,"10263":16787479,"10264":16787480,"10265":16787481,"10266":16787482,"10267":16787483,"10268":16787484,"10269":16787485,"10270":16787486,"10271":16787487,"10272":16787488,"10273":16787489,"10274":16787490,"10275":16787491,"10276":16787492,"10277":16787493,"10278":16787494,"10279":16787495,"10280":16787496,"10281":16787497,"10282":16787498,"10283":16787499,"10284":16787500,"10285":16787501,"10286":16787502,"10287":16787503,"10288":16787504,"10289":16787505,"10290":16787506,"10291":16787507,"10292":16787508,"10293":16787509,"10294":16787510,"10295":16787511,"10296":16787512,"10297":16787513,"10298":16787514,"10299":16787515,"10300":16787516,"10301":16787517,"10302":16787518,"10303":16787519,"10304":16787520,"10305":16787521,"10306":16787522,"10307":16787523,"10308":16787524,"10309":16787525,"10310":16787526,"10311":16787527,"10312":16787528,"10313":16787529,"10314":16787530,"10315":16787531,"10316":16787532,"10317":16787533,"10318":16787534,"10319":16787535,"10320":16787536,"10321":16787537,"10322":16787538,"10323":16787539,"10324":16787540,"10325":16787541,"10326":16787542,"10327":16787543,"10328":16787544,"10329":16787545,"10330":16787546,"10331":16787547,"10332":16787548,"10333":16787549,"10334":16787550,"10335":16787551,"10336":16787552,"10337":16787553,"10338":16787554,"10339":16787555,"10340":16787556,"10341":16787557,"10342":16787558,"10343":16787559,"10344":16787560,"10345":16787561,"10346":16787562,"10347":16787563,"10348":16787564,"10349":16787565,"10350":16787566,"10351":16787567,"10352":16787568,"10353":16787569,"10354":16787570,"10355":16787571,"10356":16787572,"10357":16787573,"10358":16787574,"10359":16787575,"10360":16787576,"10361":16787577,"10362":16787578,"10363":16787579,"10364":16787580,"10365":16787581,"10366":16787582,"10367":16787583,"10368":16787584,"10369":16787585,"10370":16787586,"10371":16787587,"10372":16787588,"10373":16787589,"10374":16787590,"10375":16787591,"10376":16787592,"10377":16787593,"10378":16787594,"10379":16787595,"10380":16787596,"10381":16787597,"10382":16787598,"10383":16787599,"10384":16787600,"10385":16787601,"10386":16787602,"10387":16787603,"10388":16787604,"10389":16787605,"10390":16787606,"10391":16787607,"10392":16787608,"10393":16787609,"10394":16787610,"10395":16787611,"10396":16787612,"10397":16787613,"10398":16787614,"10399":16787615,"10400":16787616,"10401":16787617,"10402":16787618,"10403":16787619,"10404":16787620,"10405":16787621,"10406":16787622,"10407":16787623,"10408":16787624,"10409":16787625,"10410":16787626,"10411":16787627,"10412":16787628,"10413":16787629,"10414":16787630,"10415":16787631,"10416":16787632,"10417":16787633,"10418":16787634,"10419":16787635,"10420":16787636,"10421":16787637,"10422":16787638,"10423":16787639,"10424":16787640,"10425":16787641,"10426":16787642,"10427":16787643,"10428":16787644,"10429":16787645,"10430":16787646,"10431":16787647,"10432":16787648,"10433":16787649,"10434":16787650,"10435":16787651,"10436":16787652,"10437":16787653,"10438":16787654,"10439":16787655,"10440":16787656,"10441":16787657,"10442":16787658,"10443":16787659,"10444":16787660,"10445":16787661,"10446":16787662,"10447":16787663,"10448":16787664,"10449":16787665,"10450":16787666,"10451":16787667,"10452":16787668,"10453":16787669,"10454":16787670,"10455":16787671,"10456":16787672,"10457":16787673,"10458":16787674,"10459":16787675,"10460":16787676,"10461":16787677,"10462":16787678,"10463":16787679,"10464":16787680,"10465":16787681,"10466":16787682,"10467":16787683,"10468":16787684,"10469":16787685,"10470":16787686,"10471":16787687,"10472":16787688,"10473":16787689,"10474":16787690,"10475":16787691,"10476":16787692,"10477":16787693,"10478":16787694,"10479":16787695,"10480":16787696,"10481":16787697,"10482":16787698,"10483":16787699,"10484":16787700,"10485":16787701,"10486":16787702,"10487":16787703,"10488":16787704,"10489":16787705,"10490":16787706,"10491":16787707,"10492":16787708,"10493":16787709,"10494":16787710,"10495":16787711,"12289":1188,"12290":1185,"12300":1186,"12301":1187,"12443":1246,"12444":1247,"12449":1191,"12450":1201,"12451":1192,"12452":1202,"12453":1193,"12454":1203,"12455":1194,"12456":1204,"12457":1195,"12458":1205,"12459":1206,"12461":1207,"12463":1208,"12465":1209,"12467":1210,"12469":1211,"12471":1212,"12473":1213,"12475":1214,"12477":1215,"12479":1216,"12481":1217,"12483":1199,"12484":1218,"12486":1219,"12488":1220,"12490":1221,"12491":1222,"12492":1223,"12493":1224,"12494":1225,"12495":1226,"12498":1227,"12501":1228,"12504":1229,"12507":1230,"12510":1231,"12511":1232,"12512":1233,"12513":1234,"12514":1235,"12515":1196,"12516":1236,"12517":1197,"12518":1237,"12519":1198,"12520":1238,"12521":1239,"12522":1240,"12523":1241,"12524":1242,"12525":1243,"12527":1244,"12530":1190,"12531":1245,"12539":1189,"12540":1200};

    function lookup(k) { return k ? {keysym: k, keyname: keynames ? keynames[k] : k} : undefined; }
    return {
        fromUnicode : function(u) { return lookup(codepoints[u]); },
        lookup : lookup
    };
})();

window.keysyms = keysyms;
export default keysyms;
