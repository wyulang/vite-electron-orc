<template>
  <div class="w-all pl10 flex fd-c h-all">
    <div class="pp10 flex ai-c">
      <span class="fs-18 white-text nodarg mr15 fc-pri ra-5 hand">国际音标</span>
      <span class="fs-18 white-text nodarg mr15 ra-5 hand">单词汇</span>
      <span class="fs-18 white-text nodarg ra-5 hand">听写纸</span>
    </div>

    <div class="flex-1 h-all  w-all">
      <div class="flex h-all pl20 pr20 w-all">
        <div class="wb-30 h-all nodarg">
          <scroll>
            <div v-for="item in yinbiao" class="flex  fs-20 ai-c">
              <div class="flex w-all  ai-c">
                <span v-if="item.type" class="nowrap fb">{{item.type}}</span>
                <div class="w-all  fd-c">
                  <div v-for="child in item.list" class="flex w-all mt30 ai-c">
                    <span class="nowrap pr30 fb">{{child.type}}</span>
                    <div class="w-all flex fd-c">
                      <div @click="info.yinbiao=v;" :class="{'fc-FF4500':info.yinbiao.example==v.example}" v-for="v in child.list" class="flex nodarg hand lh-50">
                        <span class=" flex">/<span class="w-40 fs-30 centers">{{v.symbol}}</span>/</span>
                        <span class="ml20 fs-22">例：{{v.example}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-60 w-all"></div>
          </scroll>
        </div>
        <div class="flex-1 flex fd-c h-all nodarg fs-20">
          <scroll>
            <div class="w-all pp20">
              <div class="glass-card ra-6 flex ai-c mb20 pp20">
                <span class="fc-999 nodarg hand flex fs-50 ai-c">/<span class="w-60 fc-FF4500 centers">{{info.yinbiao.symbol}}</span>/</span>
                <div class="ml50 flex-1 flex ai-c">
                  <span @click="onPlayYinbiao(0)" :class="{'icon-bofang1 fc-primary':!info.isPlay||info.isPause,'icon-bofang fc-FF4500':info.isPlay}" class="iconfont  hand nodarg  fs-50"></span>
                  <span @click="onPlayYinbiao(1)" class="fs-40 fc-pri nodarg hand ml10 iconfont icon-shuaxin-"></span>
                </div>
              </div>
              <div v-if="info.yinbiao.jiyi&&info.yinbiao.jiyi.length" class="sha-card ra-10 w-all mt20 pp20">
                <div class="flex ai-c fs-18 lh-32">{{String(info.yinbiao.jiyi)}}</div>
              </div>
              <div class="flex sha-card pp10 ra-5 mt10 ai-c w-all">
                <div class="flex w-all ai-c jc-b">
                  <div class="flex fd-c  w-b pl10 pr10 ">
                    <span @click="onPlayDanci(item)" class="lh-40 nodarg hand fs-22" v-for="item in info.yinbiao.exam">{{item}}</span>
                  </div>
                  <div>
                    <img class="w-300 ra-5" :src="images[`../assets/yinbiao/${info.yinbiao.id}m.png`]||images[`../assets/yinbiao/${info.yinbiao.id}m.gif`]" alt="">
                  </div>
                </div>
              </div>
              <div v-if="info.yinbiao.remark&&info.yinbiao.remark.length" class="sha-card w-all ra-10 mt20 pp20">
                <div class="flex ai-c fs-18 lh-32" v-for="item in info.yinbiao.remark">{{item}}</div>
              </div>
              <div class="h-50 w-all"></div>
            </div>
          </scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import yy from '@lib/mixin';
import useStore from '../store';
const st = useStore();

const images = import.meta.glob('../assets/yinbiao/*.{png,gif}', { eager: true, as: 'url' });
const ybSrc = import.meta.glob('../assets/yinbiao/*.mp3', { eager: true, as: 'url' });

const yinbiao = [
  {
    type: '',
    list: [
      {
        type: '长元音',
        list: [
          { id: 1, time: 14, "symbol": "iː", "example": "see", exam: ['He [hiː] 他', 'me [miː] 我', 'see [siː] 看见', 'need [niːd] 需要', 'eat [iːt] 吃'], jiyi: "类似汉字“衣”的读音，但声音拉长些" },
          { id: 2, time: 12, "symbol": "ɜː", "example": "bird", exam: ['bird [bɜːd] 鸟', 'word [wɜːd] 单词', 'work [wɜːk] 工作', 'learn [lɜːn] 学习', 'girl [ɡɜːl] 女孩'], jiyi: '发音类似汉字“饿”的读音，但声音要拉长些' },
          { time: 11, id: 3, "symbol": "ɑː", "example": "car", exam: ['ask /ɑːsk/ 询问', 'car /kɑː/ 汽车', 'park /pɑːk/ 公园', 'star /stɑː/ 星星', 'laugh /lɑːf/ 笑'], jiyi: '类似汉字“啊”的读音，发长音' },
          { time: 11, id: 4, "symbol": "ɔː", "example": "law", exam: ['door [dɔː] 门', 'wall [wɔːl] 墙壁', 'law [lɔː] 法律', 'horse [hɔːs] 马', 'short [ʃɔːt] 短的'], jiyi: '类似汉字“喔”的读音' },
          { time: 9, id: 5, "symbol": "uː", "example": "blue", jiyi: "类似汉字“屋”的读音", exam: ['room /ruːm/ 房间', 'food /fuːd/ 食物', 'fruit /fruːt/ 水果', 'move /muːv/ 移动', 'true /truː/ 真实的'] }
        ]
      },
      {
        type: '短元音',
        list: [
          { time: 13.5, id: 6, "symbol": "ɪ", jiyi: "", "example": "sit", exam: ['it [ɪt] 它', 'big [bɪɡ] 大的', 'sit [sɪt] 坐', 'six [sɪks] 六', 'give [ɡɪv] 给'] },
          { time: 11, id: 7, "symbol": "e", jiyi: "", "example": "bed", exam: ['egg /eɡ/ 鸡蛋', 'bed /bed/ 床', 'many /ˈmeni/ 许多', 'head /hed/ 头', 'bread /bred/ 面包'] },
          { time: 10, id: 8, "symbol": "æ", jiyi: "嘴巴既要张大，嘴形还要保持扁平", "example": "cat", exam: ['发[ æ ]音常见的字母：a', 'apple /ˈæpl/ 苹果', 'cat /kæt/ 猫', 'flag /flæɡ/ 旗帜', 'fat /fæt/ 胖的', 'black /blæk/ 黑色'], remark: ['bad /bæd/ 坏的 VS.  bed /bed/ 床', 'pan /pæn/ 平底锅  VS.  pen /pen/ 钢笔', 'had  /hæd/ 有  VS.  head /hed/ 头'] },
          { time: 12, id: 9, "symbol": "ʌ", jiyi: "类似汉字“啊”的读音，发音短促", "example": "cup", exam: ['bus /bʌs/ 公共汽车', 'cup /kʌp/ 杯子', 'come /kʌm/ 来', 'touch /tʌtʃ/ 接触', 'blood /blʌd/ 血液'], remark: ['[ ʌ ]与[ æ ]的发音比较', '发/ʌ/音时，嘴形稍圆一些', '发/æ/音时，嘴形稍扁一些', 'cut /kʌt/ 切 VS.  cat /kæt/ 猫', 'bud /bʌd/ 萌芽 VS.  bad /bæd/ 坏的', 'hut /hʌt/ 小屋  VS. hat /hæt/ 帽子'] },
          { time: 11, id: 10, "symbol": "ɒ", jiyi: "口型比长元音/ɔ:/更大一点", "example": "hot (UK)", exam: ['hot /hɒt/ 热的', 'doctor /ˈdɒktə/ 医生', 'office /ˈɒfɪs/ 办公室', 'wash /wɒʃ/ 洗', 'want /wɒnt/ 想要'], remark: ['[ ɔː ]是长元音，发音稍微拉长', '[ ɒ ]是短元音，发音短促有力', 'short [ʃɔːt] 短的 VS. shot /ʃɒt/ 发射、镜头', 'caught /kɔːt/ 抓住 VS. cot /kɒt/ 简易床'] },
          { time: 10.5, id: 11, "symbol": "ʊ", jiyi: "", "example": "book", remark: ['[ uː ]是长元音，发音稍微拉长，嘴形较扁', '[ ʊ ]是短元音，发音短促有力，嘴形较开', 'fool [fuːl] 傻瓜 VS. full /fʊl/ 满的', 'food /fuːd/ 食物 VS. foot /fʊt/ 脚', 'pool /puːl/ 水塘 VS. pull /pʊl/ 拉'], exam: ['good /ɡʊd/ 好的', 'book /bʊk/ 书', 'look /lʊk/ 看', 'put /pʊt/ 放', 'could /kʊd/ 可能'] },
          { time: 12, id: 12, "symbol": "ə", jiyi: "很像汉语拼音“e”或汉字“饿”的读音。", "example": "about", exam: ['ago [əˈɡəʊ] 以前', 'about [əˈbaʊt] 大约', 'sofa [ˈsəʊfə] 沙发', 'panda [ˈpændə] 熊猫', 'driver [ˈdraɪvə] 司机'] }
        ]
      }
    ]
  },
  {
    type: '双元音',
    list: [
      {
        type: '',
        list: [
          { time: 53, id: 13, remark: "", "symbol": "eɪ", jiyi: "类似汉语拼音“ei”的读音，但[eɪ]有音滑动的过程，发音时间更长些。", "example": "day", exam: ['cake /keɪk/ 蛋糕', 'fail /feɪl/ 失败', 'play /pleɪ/ 玩耍', 'eight /eɪt/ 八', 'break /breɪk/  打破'] },
          { time: 10.5, id: 14, "symbol": "aɪ", jiyi: "类似汉语拼音“ai”的读音", "example": "eye", exam: ['bike /baɪk/ 自行车', 'sky /skaɪ/ 天空', 'lie /laɪ/ 说谎', 'light /laɪt/ 灯', 'buy /baɪ/ 买'] },
          { time: 11, id: 15, "symbol": "ɔɪ", jiyi: "听起来有点像汉字“喔”和“衣”连在一起的发音。", "example": "boy", exam: ['oil /ɔɪl/ 石油', 'coin /kɔɪn/ 硬币', 'soil /sɔɪl/ 土壤', 'joy /dʒɔɪ/ 欢乐', 'toy /tɔɪ/ 玩具'] },
          { time: 11, id: 16, "symbol": "əʊ", jiyi: "类似拼音“ou”或汉字“欧”的读音", "example": "go (UK)", exam: ['nose /nəʊz/ 鼻子', 'boat /bəʊt/ 小船', 'toe /təʊ/ 脚趾', 'show /ʃəʊ/ 显示', 'snow /snəʊ/ 下雪'], remark: ['[ əʊ ]是双元音，发音时从一个音的嘴型滑向另一个音，嘴型变小而圆。', '[ ɔː ]是单元音长音，在发音时嘴型不变，声音拉长。', 'low /ləʊ/ 低的 VS. law /lɔː/ 法律', 'bowl /bəʊl/ 碗 VS. ball /bɔːl/ 球', 'so /səʊ/ 所以  VS. saw /sɔː/ 看见'] },
          { time: 11, id: 17, "symbol": "aʊ", jiyi: "类似汉字“啊澳”连在一起的读音", "example": "now", exam: ['house /haʊs/ 房子', 'loud /laʊd/ 大声的', 'how /haʊ/ 如何，怎样', 'cow /kaʊ/ 奶牛', 'crowd /kraʊd/ 人群'] },
          { time: 11, id: 18, "symbol": "ɪə", jiyi: "", "example": "ear (UK)", exam: ['idea /aɪˈdɪə/ 想法', 'ear /ɪə(r)/ 耳朵', 'hear /hɪə(r)/ 听见', 'beer /bɪə(r)/ 啤酒', 'deer /dɪə(r)/ 鹿', 'here /hɪə(r)/ 在这里'], remark: ['美国人通常会把单词中的每个“r”音都发到位;', '英国人则只发元音之前的字母“r”音(如red [red])', ' ', '元音之后的字母“r”不发音或发[ ə ] (如hear [hɪə])。'] },
          { time: 11, id: 19, "symbol": "eə", jiyi: "", "example": "air (UK)", exam: ['air /eə(r)/ 空气', 'fair /feə(r)/ 公平的', 'care /keə(r)/ 关心', 'pear /peə(r)/ 梨', 'their /ðeə(r)/ 他(她/它)们的', 'where /weə(r)/ 在哪里'] },
          { time: 11, id: 20, "symbol": "ʊə", jiyi: "", "example": "tour (UK)", exam: ['tour /tʊə（r）/ 旅行', 'pure /pjʊə（r）/ 纯粹的', 'cure /kjʊə（r）/ 治愈', 'poor /pʊə（r）/ 贫穷的', 'moor /mʊə（r）/ 荒原'] }
        ]
      }
    ]
  },
  {
    type: '清辅音',
    list: [
      {
        type: '',
        list: [
          { time: 91, id: 21, "symbol": "p", jiyi: "", "example": "pen", exam: ['park /pɑːk/ 公园', 'put /pʊt/ 放', 'happy /ˈhæpi/ 高兴的', '[ p ]在元音之后：', 'cup /kʌp/ 杯子', 'tip /tɪp/ 小费', 'top /tɒp/ 顶端'], remark: ['[ p ]在元音之前：发类似拼音“p”的读音，但需去掉尾音。', '[ p ]在元音之后：发类似拼音“pu”的读音，仍需去掉尾音。'] },
          { time: 11, id: 22, "symbol": "t", jiyi: "", "example": "tea", exam: ['cat /kæt/ 猫', 'tiger /ˈtaɪɡə/ 老虎', 'time /taɪm/ 时间', 'pretty /ˈprɪti/ 漂亮的', 'letter /ˈletə/ 信，字母', 'ticket /ˈtɪkɪt/ 票，入场券'] },
          { time: 11, id: 23, "symbol": "k", jiyi: "", "example": "cat", exam: ['dark /dɑːk/ 黑暗的', 'cake /keɪk/ 蛋糕', 'clean /kliːn/ 干净的', 'black /blæk/ 黑色的', 'clock /klɒk/ 时钟', 'Christmas /ˈkrɪsməs/ 圣诞节'] },
          { time: 11, id: 24, "symbol": "f", jiyi: "", "example": "fish", exam: ['face /feɪs/ 脸', 'fast /fɑːst/ 快速的', 'photo /ˈfəʊtəʊ/ 照片', 'phone /fəʊn/ 电话', 'laugh /lɑːf/ 笑', 'cough /kɒf/ 咳嗽'] },
          { time: 11.5, id: 25, "symbol": "θ", jiyi: "发[ θ ]音常见的字母组合有：th", "example": "think", exam: ['thank /θæŋk/ 谢谢', 'think /θɪŋk/ 想，认为', 'three /θriː/ 三', 'mouth /maʊθ/ 嘴', 'tooth /tuːθ/ 牙齿'], remark: ['[ θ ]吐舌头', '[ s ]不吐舌头', 'thing /θɪŋ/ 事情 VS. sing /sɪŋ/ 唱歌', 'thick /θɪk/ 厚的 VS. sick /sɪk/ 生病的', 'mouth /maʊθ/ 嘴  VS. mouse /maʊs/ 老鼠'] },
          { time: 11, id: 26, "symbol": "s", jiyi: "", "example": "sun", exam: ['snake /sneɪk/ 蛇', 'this /ðɪs/ 这个', 'pencil /ˈpensl/ 铅笔', 'class /klɑːs/ 班级', 'police /pəˈliːs/ 警察'], remark: ['单音节  space /speɪs/ 空间    实际读：/sbeɪs/ ', '单音节  star /stɑː(r)/ 星星      实际读：/sdɑː(r)/', '单音节  school /skuːl/ 学校    实际读：/sguːl/', '重读音节  spacious /ˈspeɪʃəs/ 宽敞的   实际读：/ˈsbeɪʃəs/', '重读音节  standing /ˈstændɪŋ/ 站立   实际读：/ˈsdændɪŋ/ ', '重读音节  skating /ˈskeɪtɪŋ/ 滑冰   实际读：/ˈsgeɪtɪŋ/'] },
          { time: 11, id: 27, "symbol": "ʃ", jiyi: "", "example": "shoe", exam: ['sugar /ˈʃʊɡə(r)/ 糖', 'she /ʃiː/ 她', 'fish /fɪʃ/ 鱼', 'delicious /dɪˈlɪʃəs/ 美味的', 'machine /məˈʃiːn/ 机器'] },
          { time: 11, id: 28, "symbol": "tʃ", jiyi: "", "example": "chat", exam: ['child /tʃaɪld/ 小孩', 'rich /rɪtʃ/ 富有的', 'nature /ˈneɪtʃə(r)/ 自然  ', 'watch /wɒtʃ/ 注视，手表', 'catch /kætʃ/ 赶上，抓住'] },
          { time: 11, id: 29, "symbol": "tr", jiyi: "", "example": "tree (UK)", exam: ['try /traɪ/ 尝试', 'trip /trɪp/ 旅行', 'tree /triː/ 树', 'true /truː/ 真实的', 'trouble /ˈtrʌbl/ 麻烦'] },
          { time: 11, id: 30, "symbol": "ts", jiyi: "和汉字“次”的声母", "example": "cats", exam: ['hats /hæts/ 帽子（复数）', 'cats /kæts/ 猫（复数）', 'ants /ænts/ 蚂蚁（复数）', 'boats /bəʊts/ 船（复数）', 'gates /ɡeɪts/ 大门（复数）'] },
          { time: 11, id: 31, "symbol": "h", jiyi: "类似汉语拼音“h”或汉字“喝”的读音，需去掉尾音。", "example": "hat", exam: ['hat /hæt/ 帽子', 'hot /hɒt/ 热的', 'high /haɪ/ 高的', 'house /haʊs/ 房子', 'who /huː/ 谁', 'whole /həʊl/ 完整的'] }
        ]
      }
    ]
  },
  {
    type: '浊辅音',
    list: [
      {
        type: '',
        list: [
          { time: 11, id: 32, "symbol": "b", jiyi: ['[ b ]在元音之前：发类似拼音“b”的读音，有声音。', '[ b ]在元音之后：发类似拼音“bu”的读音，有声音，但声音很弱。'], "example": "boy", exam: ['[ b ]在元音之前：', 'beef /biːf/ 牛肉', 'boat /bəʊt/ 小船', 'rabbit /ˈræbɪt/ 兔子', '[ b ]在元音之后：', 'job /dʒɒb/ 工作', 'rob /rɒb/ 抢劫', 'Bob /bɒb/ 鲍勃(人名)'], remark: ['/p/发音时气流强大，但声带不振动，因此声音不响亮', '/b/发音时气流微弱，但声带振动强烈，因此声音响亮', 'bear /beə/ 熊 VS. pear /peə/ 梨', 'bet /bet/ 打赌 VS. pet /pet/ 宠物', 'back /bæk/ 背部  VS. pack /pæk/ 包装'] },
          { time: 11, id: 33, "symbol": "d", jiyi: [], "example": "dog", exam: ['date /deɪt/ 日期', 'deep /diːp/ 深的', 'middle /ˈmɪdl/ 中间的', 'daddy /ˈdædi/ 爸爸', 'bread /bred/ 面包'], remark: ['[ d ]发音时气流微弱，但声带振动强烈，因此声音响亮', '[ t ]发音时气流强大，但声带不振动，因此声音不响亮', 'do /duː/ 做 VS. two /tuː/ 二', 'down /daʊn/ 向下 VS. town /taʊn/ 城镇', 'bed /bed/ 床  VS. bet /bet/ 打赌'] },
          { time: 11, id: 34, "symbol": "g", jiyi: ['[ ɡ ]在元音之前：发类似拼音“g”的读音，发音短促有声音。', '[ ɡ ]在元音之后：发类似拼音“g”的读音，发音很弱几乎听不见。'], "example": "go", exam: ['[ ɡ ]在元音之前：', 'get /ɡet/ 获得', 'luggage /ˈlʌɡɪdʒ/ 行李', 'ghost /ɡəʊst/ 鬼', 'guest /ɡest/ 客人', '[ ɡ ]在元音之后：', 'bag /bæɡ/ 包', 'egg /eɡ/ 鸡蛋', 'colleague /ˈkɒliːɡ/ 同事'], remark: ['[ ɡ ]发音时气流微弱，但声带振动强烈，因此声音响亮', '[ k ]发音时气流强大，但声带不振动，因此声音不响亮', 'gap /ɡæp/ 缝隙 VS. cap /kæp/ 帽子', 'gold /ɡəʊld/ 黄金 VS. cold /kəʊld/ 寒冷的', 'pig /pɪɡ/  猪  VS. pick /pɪk/ 挑选'] },
          { time: 11, id: 35, "symbol": "v", jiyi: "", "example": "van", exam: ['very /ˈveri/ 非常', 'visit /ˈvɪzɪt/ 参观', 'village /ˈvɪlɪdʒ/ 乡村', 'love /lʌv/ 爱', 'move /muːv/ 移动'], remark: ['[ v ]是浊辅音，声音靠声带振动产生，出现在词首时声音响亮，', '出现在词尾时声音很弱，几乎听不见。', '[ f ]是清辅音，声带不振动，声音完全是气流的声音。', 'vast /vɑːst/ 巨大的 VS. fast /fɑːst/ 快速的'] },
          { time: 11, id: 36, "symbol": "ð", jiyi: "", "example": "this", exam: ['father /ˈfɑːðə(r)/ 父亲', 'mother /ˈmʌðə(r)/ 母亲', 'weather /ˈweðə(r)/ 天气', 'this /ðɪs/ 这个', 'that /ðæt/ 那个'], remark: ['一般来说，th位于词首、位于词尾、在数词中，读[ θ ]', '如：thank', ' think', ' Thursday | mouth', ' tooth', ' both | three', ' third', ' fourth', 'th加-er结尾、在代词、冠词、介词、连词或副词中，读[ ð ]', '如：father', ' mother', ' gather | this', ' that', ' thus'] },
          { time: 11, id: 37, "symbol": "z", jiyi: "", "example": "zoo", exam: ['zoo /zuː/ 动物园', 'zebra /ˈziːbrə/ 斑马', 'busy /ˈbɪzi/ 忙碌的', 'size /saɪz/ 尺寸', 'rose /rəʊz/ 玫瑰花'], remark: ['[ s ]是清辅音，不振动声带；', '[ z ] 是浊辅音，振动声带；', '当[ z ] 出现在词尾，在正常语速时发音很轻，几乎像个清辅音。', 'sue /suː/ 起诉 VS. zoo /zuː/ 动物园', 'ice /aɪs/ 冰 VS. eyes /aɪz/ 眼睛', 'price /praɪs/ 价格  VS. prize /praɪz/ 奖品'] },
          { time: 11, id: 38, "symbol": "ʒ", jiyi: "", "example": "pleasure", exam: ['usually /ˈjuːʒəli/ 通常', 'pleasure /ˈpleʒə(r)/ 愉快', 'measure /ˈmeʒə(r)/ 测量', 'leisure /ˈleʒə(r)/ 空闲', 'garage /ˈɡærɑːʒ/ 车库'] },
          { time: 11, id: 39, "symbol": "dʒ", jiyi: "", "example": "jump", exam: ['jeep /dʒiːp/ 吉普车', 'gym /dʒɪm/ 健身房', 'age /eɪdʒ/ 年龄', 'bridge /brɪdʒ/ 桥', 'fridge /frɪdʒ/ 冰箱'], remark: ['[ dʒ ]是浊辅音，振动声带', '[ tʃ ]是清辅音，不振动声带', 'joke /dʒəʊk/ 玩笑 VS. choke /tʃəʊk/ 窒息', 'jeep /dʒiːp/ 吉普车 VS. cheap /tʃiːp/ 便宜的', 'job /dʒɒb/ 工作  VS. chop /tʃɒp/ 切碎'] },
          { time: 11, id: 40, "symbol": "dr", jiyi: "", "example": "dream", exam: ['dry /draɪ/ 干的', 'draw /drɔː/ 画画', 'drive /draɪv/ 开车', 'drink /drɪŋk/ 喝', 'dream /driːm/ 梦想'] },
          { time: 11, id: 41, "symbol": "dz", jiyi: "", "example": "beds", exam: ['beds /bedz/ 床（复数）', 'seeds /si:dz/ 种子（复数）', 'hands /hændz/ 手（复数）', 'kids /kidz/ 小孩（复数）', "grades /ɡ'reɪdz/ 等级（复数）"] },
          { time: 13, id: 42, "symbol": "m", jiyi: "", "example": "man", exam: ['[ m ]在元音之前：', 'me /miː/ 我', 'meet /miːt/ 遇见', 'milk /mɪlk/ 牛奶', 'map /mæp/ 地图', '[ m ]在元音之后：', 'some /sʌm/ 一些', 'comb /kəʊm/ 梳子', 'climb /klaɪm/ 爬', 'autumn /ˈɔːtəm/ 秋天'] },
          { time: 13, id: 43, "symbol": "n", jiyi: "", "example": "no", exam: ['[ n ]在元音之前：', 'nice /naɪs/ 美好的', 'night /naɪt/ 夜晚', 'dinner /ˈdɪnə(r)/ 晚餐', 'know /nəʊ/ 知道', '[ n ]在元音之后：', 'son /sʌn/ 儿子', 'run /rʌn/ 奔跑', 'hand /hænd/ 手'] },
          { time: 11, id: 44, "symbol": "ŋ", jiyi: "", "example": "sing", exam: ['thank /θæŋk/ 感谢', 'drink /drɪŋk/ 喝', 'monkey /ˈmʌŋki/ 猴子', 'thing /θɪŋ/ 事情', 'spring /sprɪŋ/ 春天'], remark: ['[ m ] ：嘴唇闭合，舌头平放', '[ n ] ：嘴唇张开，舌前端抵住上齿龈', '[ ŋ ]：嘴唇张开，舌后端抵住软腭，口腔后部发音'] },
          { time: 11, id: 45, "symbol": "l", jiyi: "", "example": "leg", exam: ['[ l ]在元音之前：', 'like /laɪk/ 喜欢', 'lock /lɒk/ 锁', 'sleep /sliːp/ 睡觉', '[ l ]在元音之后：', 'tell /tel/ 告诉', 'bell /bel/ 铃', 'sale /seɪl/ 出售'], remark: ['[ r ]舌尖悬空，往后卷舌', '[ l ] 舌尖翘起，抵住上齿龈', 'right /raɪt/ 正确的 VS. light /laɪt/ 灯', 'rock /rɒk/ 岩石 VS. lock /lɒk/ 锁', 'wrong /rɒŋ/ 错误的  VS. long /lɒŋ/ 长的'] },
          { time: 11, id: 46, "symbol": "r", jiyi: "", "example": "red", exam: ['[ r ]在元音之前：', 'red /red/ 红色', 'read /riːd/ 读', 'ride /raɪd/ 骑', 'write /raɪt/ 写', '[ r ]在元音之后：', 'car /kɑː(r)/ 汽车', 'ear /ɪə(r)/ 耳朵', 'care /keə(r)/ 关心', 'poor /pʊə(r)/ 贫穷的'], remark: ['在句子中，如果字母“r”出现在一个单词末尾，而下一个单词以元音开头，则可以辅音+元音连读，读出“r”音，比如：', 'My caris blue.', '/maɪ kɑː rɪz bluː/'] },
          { time: 11.5, id: 47, "symbol": "j", jiyi: "", "example": "yes", exam: ['yes /jes/ 是的', 'yell /jel/ 叫喊', 'yellow /ˈjeləʊ/ 黄色的', 'young /jʌŋ/ 年轻的', 'yesterday /ˈjestədeɪ/ 昨天', '辅音[ j ] + 元音[ uː ] = 音节 [ juː ]', 'use /juːz/ 使用', 'beauty /ˈbjuːti/ 美丽', 'cute /kjuːt/ 可爱的', 'few /fjuː/ 很少的'], remark: [`[ j ]的发音听上去像元音[ iː ]或[ ɪ ]，但发音时气流受到阻碍形成了辅音特点，这也是为什么[ j ]又被称作“半元音”。`] },
          { time: 12, id: 48, "symbol": "w", jiyi: "", "example": "wet", exam: ['we /wiː/ 我们', 'wide /waɪd/ 宽阔的', 'swim /swɪm/ 游泳', 'why /waɪ/ 为什么', 'white /waɪt/ 白色的'], remark: ['[ w ]双唇向前突出，不需要用到牙齿', '[ v ]上牙齿轻触下唇', 'wet /wet/ 潮湿的  VS. vet /vet/ 兽医', 'west /west/ 西方 VS. vest /vest/ 背心', 'wine /waɪn/ 葡萄酒 VS. vine /vaɪn/ 葡萄藤'] }
        ]
      }
    ]
  }
]

const info = reactive({
  yinbiao: yinbiao[0].list[0].list[0],
  playAudio: null,
  isPlay: false,
  isPause: false,
  playId: 0,
})

function onPlayDanci(text){
  // console.log();
  st.speek(text.replace(/\s|\[.+\]|[\u4e00-\u9fa5]|\/.+/g,''))
}

function onPlayYinbiao(type) {
  if (info.playAudio) {
    if (type) {
      info.playAudio.pause();
      info.playAudio = null;
      info.isPause = false;
      info.isPlay = true;
    } else {
      if (info.yinbiao.id == info.playId) {
        if (info.isPause) {
          info.playAudio.play();
          info.isPause = false;
        } else {
          info.playAudio.pause();
          info.isPause = true;
        }
        return;
      } else {
        info.playAudio.pause();
        info.playAudio = null;
      }
    }
  }

  info.playAudio = new Audio(ybSrc[`../assets/yinbiao/${info.yinbiao.id}.mp3`]);
  info.playAudio.currentTime = info.yinbiao.time;
  info.playAudio.play()
  info.isPlay = true;
  info.playId = info.yinbiao.id;
  info.playAudio.addEventListener('ended', e => {
    info.isPlay = false;
  })
  info.playAudio.addEventListener('pause', e => {
    info.isPause = true;
  })
}

</script>

<style lang='less'>
</style>