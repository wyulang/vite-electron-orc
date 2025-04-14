<template>
  <div id="editorYuyue" :class="{'fixed al0 ab0 at0 al0':info.fullScreen,'rel':!info.fullScreen}" class="w-all flex ra-5 sha-card editor-body fd-c h-all">
    <section @click="info.isButtonClick=true;" style="-webkit-user-select: none;" class="w-all pl5 pb5">
      <div class="w-all h-all flex fw  ai-c pb5 ra-5 ">
        <div @click.stop="onTabSet('正文')" class="item-list pr1">
          <span class="ft-filte nowrap">正文</span>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-if="info.currtab=='正文'&&info.show" class="abs w-100 al0 at22 pt6">
            <div @click="onSetHtitle" class="w-all bc-fff flex fd-c sha-card ra-5">
              <h1 class="flex ai-c hover-item pl10 pr10">H1 标题</h1>
              <h2 class="flex ai-c hover-item pl10 pr10">H2 标题</h2>
              <h3 class="flex ai-c hover-item pl10 pr10">H3 标题</h3>
              <h4 class="flex ai-c hover-item pl10 pr10">H4 标题</h4>
              <h5 class="flex ai-c hover-item pl10 pr10">H5 标题</h5>
              <h6 class="flex ai-c hover-item pl10 pr10">H6 标题</h6>
            </div>
          </div>
        </div>
        <div @click.stop="onTabSet('字体')" class="item-list pr1 ml5">
          <span class="ft-filte nowrap">字体</span>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-if="info.currtab=='字体'&&info.show" class="abs w-100 al0 at22 pt6">
            <div @click="onFontFamily" class="w-all custom-scrollbar h-200 bc-fff flex fd-c sha-card ra-5">
              <div data="" class="flex ai-c hover-item pl10 pr10">默认字体</div>
              <div data="SimSun" class="flex ai-c hover-item pl10 pr10">宋体</div>
              <div data="FangSong" class="flex ai-c hover-item pl10 pr10">仿宋</div>
              <div data="SimHei" class="flex ai-c hover-item pl10 pr10">黑体</div>
              <div data="Microsoft YaHei" class="flex ai-c hover-item pl10 pr10">微软雅黑</div>
              <div data="STHeiti Light" class="flex ai-c hover-item pl10 pr10">华文细黑</div>
              <div data="LiSu" class="flex ai-c hover-item pl10 pr10">隶书</div>
              <div data="YouYuan" class="flex ai-c hover-item pl10 pr10">幼圆</div>
              <div data="FZShuTi" class="flex ai-c hover-item pl10 pr10">方正舒体</div>
              <div data="FZYaoti" class="flex ai-c hover-item pl10 pr10">方正姚体</div>
              <div data="MingLiU" class="flex ai-c hover-item pl10 pr10">细明体</div>
              <div data="DFKai-SB" class="flex ai-c hover-item pl10 pr10">标楷体</div>
              <div data="Arial" class="flex ai-c hover-item pl10 pr10">Arial(数字)</div>
            </div>
          </div>
        </div>
        <div @click.stop="onTabSet('字号')" class="item-list pr1 ml5">
          <span class="ft-filte nowrap">字号</span>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-show="info.currtab=='字号'&&info.show" class="abs flex-line al0 at22 pt6">
            <div @click="onSetFontSize" class="bc-fff w-50 h-200 custom-scrollbar fd-c flex sha-card ra-5">
              <div :data="item" class="w-all h-30 hover-item flex fs-12 ai-c jc-c" v-for="item in 91">{{item+8}}</div>
            </div>
          </div>
        </div>
        <div @click.stop="onTabSet('颜色')" class="item-list pr1 ml5">
          <span class="ft-filte nowrap">颜色</span>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-show="info.currtab=='颜色'&&info.show" class="abs flex-line al0 at22 pt6">
            <div @click.stop class="sha-6 bc-fff pp10 flex fd-c ra-5">
              <div @click.stop class="flex bb-d fs-15 mb10 pt5 pb15 ai-c">
                <div @click.stop="info.colorType='fc'" class="flex rel ai-c">
                  <span v-if="info.colorType=='fc'" class="w-25 h-2 ra-2 bc-primary abs ab-5 absl"></span>
                  <span :class="{'fc-aa fb':info.colorType=='fc'}">字体颜色</span>
                </div>
                <div @click.stop="info.colorType='bc'" class="flex rel ml10 ai-c">
                  <span v-if="info.colorType=='bc'" class="w-25 h-2 ra-2 bc-primary abs ab-5 absl"></span>
                  <span :class="{'fc-aa fb':info.colorType=='bc'}">字体背景颜色</span>
                </div>
              </div>
              <canvas width="255" height="255" id="idColor"></canvas>
            </div>
          </div>
        </div>
        <div @click.stop="onTabSet('对齐')" class="item-list pr1 ml5">
          <span class="ft-filte nowrap">对齐</span>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-if="info.currtab=='对齐'&&info.show" class="abs w-70 al0 at22 pt6">
            <div @click="onTextAlign" class="w-all bc-fff flex fd-c sha-card ra-5">
              <div data-value="left" class="flex ai-c hover-item pl10 pr10">左对齐</div>
              <div data-value="right" class="flex ai-c hover-item pl10 pr10">右对齐</div>
              <div data-value="center" class="flex ai-c hover-item pl10 pr10">居中对齐</div>
              <div data-value="justify" class="flex ai-c hover-item pl10 pr10">两端对齐</div>
            </div>
          </div>
        </div>
        <div @click.stop="onTabSet('行高')" class="item-list pr1 ml5">
          <span class="ft-filte nowrap">行高</span>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-show="info.currtab=='行高'&&info.show" class="abs flex-line al0 at22 pt6">
            <div @click="onLineHeight" class="bc-fff w-50 h-200 custom-scrollbar fd-c flex sha-card ra-5">
              <div :data-value="item" class="w-all h-30 hover-item flex fs-12 ai-c jc-c" v-for="item in 91">{{item+8}}</div>
            </div>
          </div>
        </div>
        <div @click.stop="onTabSet('列表')" class="item-list pr1 ml5">
          <span class="ft-filte nowrap">列表</span>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-if="info.currtab=='列表'&&info.show" class="abs w-70 al0 at22 pt6">
            <div @click="onSetList" class="w-all bc-fff flex fd-c sha-card ra-5">
              <div data-value="ul" class="flex ai-c hover-item pl10 pr10">无序列表</div>
              <div data-value="ol" class="flex ai-c hover-item pl10 pr10">有序列表</div>
              <!-- <div data-value="radio" class="flex ai-c hover-item pl10 pr10">单选列表</div>
              <div data-value="check" class="flex ai-c hover-item pl10 pr10">多选列表</div> -->
            </div>
          </div>
        </div>
        <div @click.stop="onTabSet('上传')" class="item-list pr1 ml5">
          <span class="ft-filte nowrap">上传</span>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-if="info.currtab=='上传'&&info.show" class="abs w-70 al0 at22 pt6">
            <div @click="onOpenFile" class="w-all bc-fff flex fd-c sha-card ra-5">
              <div data-value="image-url" class="flex ai-c hover-item pl10 pr10">网络图片</div>
              <div data-value="image-up" class="flex ai-c hover-item pl10 pr10 rel">
                <input @change="changeImage" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" class="abs zi-120 hand op-0 w-all hand at0 ab0 ar0 ab0" type="file">
                <span class="zi-100 w-all h-all">上传图片</span>
              </div>
              <div data-value="video-url" class="flex ai-c hover-item pl10 pr10">网络视频</div>
              <div data-value="image-up" class="flex ai-c hover-item pl10 pr10 rel">
                <input @change="changeVideo" accept="video/*" class="abs zi-120 hand op-0 w-all hand at0 ab0 ar0 ab0" type="file">
                <span class="zi-100 w-all h-all">上传视频</span>
              </div>
              <div data-value="file-url" class="flex ai-c hover-item pl10 pr10">网络文件</div>
              <div data-value="image-up" class="flex ai-c hover-item pl10 pr10 rel">
                <input @change="changeFile" accept="*" class="abs zi-120 hand op-0 w-all hand at0 ab0 ar0 ab0" type="file">
                <span class="zi-100 w-all h-all">文件上传</span>
              </div>
            </div>
          </div>
        </div>
        <div @click.stop="onYinYong" class="pr7 h-23 item-list ml5">
          <!-- <span class="ft-filte nowrap">引用</span> -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-13 h-13" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd"
              d="M9.213 12.75c-.084.774-.308 1.392-.698 1.94c-.523.731-1.4 1.414-2.85 2.14a.75.75 0 1 0 .67 1.34c1.55-.774 2.673-1.591 3.4-2.61c.741-1.036 1.015-2.203 1.015-3.56V7.5A1.75 1.75 0 0 0 9 5.75H5A1.75 1.75 0 0 0 3.25 7.5V11c0 .966.784 1.75 1.75 1.75zm10 0c-.084.774-.308 1.392-.698 1.94c-.523.731-1.4 1.414-2.85 2.14a.75.75 0 1 0 .67 1.34c1.55-.774 2.673-1.591 3.4-2.61c.741-1.036 1.015-2.203 1.015-3.56V7.5A1.75 1.75 0 0 0 19 5.75h-4a1.75 1.75 0 0 0-1.75 1.75V11c0 .966.784 1.75 1.75 1.75z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div @click.stop="onTabSet('表格')" class="pr7 h-23 item-list ml5">
          <!-- 表格 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-17 h-17" viewBox="0 0 24 24">
            <g fill="none">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M3 8v6m0-6h6m12 0v6m0-6H9m12 6v4a2 2 0 0 1-2 2H9m12-6H9m-6 0v4a2 2 0 0 0 2 2h4m-6-6h6m0-6v6m0 0v6m6-12v12" />
              <path fill="currentColor" d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3z" />
            </g>
          </svg>
          <svg class="w-15 h-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 14L8 10H16L12 14Z"></path>
          </svg>
          <div v-if="info.currtab=='表格'&&info.show" class="abs w-100 absl at22 pt6">
            <div @mouseleave="info.table.x=0;info.table.y=0;" @click="onCreateTable" style="width:222px" class="w-all bc-fff flex fw sha-card pp5 ra-5">
              <div class="pt5 pb5 w-all pr3 pl3 flex ai-c jc-b">
                <span>插入表格</span>
                <span>{{info.table.x}} 行 {{info.table.y}} 列</span>
              </div>
              <div v-for="item in 100" @mouseover="e=>{info.table.x = Number(e.target.dataset.x);info.table.y = Number(e.target.dataset.y)}" :class="{'bc-f5':(info.table.x>=(Math.floor((item - 1) / 10)+1)&&info.table.y>=(((item - 1) % 10)+1))}" :data-x="Math.floor((item - 1) / 10)+1" :data-y="((item - 1) % 10)+1"
                class="w-20 h-20 ml1 mt1 b-d"></div>
            </div>
          </div>
        </div>
        <div class="pr5 h-23 pr7 h-23 item-list ml5 ml5">
          <!-- 拼音 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-15 h-15" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="m17.934 3.036l1.732 1L18.531 6H21v2h-2v4h2v2h-2v7h-2v-7h-3.084c-.325 2.862-1.564 5.394-3.37 7.193l-1.562-1.27c1.52-1.438 2.596-3.522 2.917-5.922L10 14v-2l2-.001V8h-2V6h2.467l-1.133-1.964l1.732-1L14.777 6h1.444zM5 13.803l-2 .536v-2.071l2-.536V8H3V6h2V3h2v3h2v2H7v3.197l2-.536v2.07l-2 .536V18.5A2.5 2.5 0 0 1 4.5 21H3v-2h1.5a.5.5 0 0 0 .492-.41L5 18.5zM17 8h-3v4h3z" />
          </svg>
        </div>
        <div @click.stop="info.fullScreen=!info.fullScreen" class="pr7 h-23 item-list ml5">
          <!-- 全屏 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-15 h-15" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path
                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path fill="currentColor"
                d="M18.5 5.5H16a1.5 1.5 0 0 1 0-3h3A2.5 2.5 0 0 1 21.5 5v3a1.5 1.5 0 0 1-3 0zM8 5.5H5.5V8a1.5 1.5 0 1 1-3 0V5A2.5 2.5 0 0 1 5 2.5h3a1.5 1.5 0 1 1 0 3m0 13H5.5V16a1.5 1.5 0 0 0-3 0v3A2.5 2.5 0 0 0 5 21.5h3a1.5 1.5 0 0 0 0-3m8 0h2.5V16a1.5 1.5 0 0 1 3 0v3a2.5 2.5 0 0 1-2.5 2.5h-3a1.5 1.5 0 0 1 0-3" />
            </g>
          </svg>
        </div>
      </div>
    </section>
    <!-- contenteditable -->
    <!-- @keydown="onKeydown" -->
    <div @keydown="onKeydown" @mouseup="onsMouseup" v-html="innerText" @input="changeText" @click="onEditerClick" @blur="onBlur" @focus="onFocus" @mousedown="onMousedown" ref="editor" autocorrect="off" autocomplete="off" spellcheck="false"
      class="outline fs-15 custom-scrollbar pl10 pb10 pr10 w-all flex-1 selected-range" contenteditable="true">
    </div>

    <!-- 网络文件上传 -->
    <div v-if="info.isFile&&info.fileType.includes('-url')" class="abs at60 al20 flex-line ra-5 sha-card pp15 bc-fff">
      <div class="flex ai-e fd-c">
        <span v-if="info.fileMsg" class="fs-12 mb3" style="color:red">{{info.fileMsg}}</span>
        <input :placeholder="info.placeholder" @input="info.fileMsg=''" v-model="info.fileUrl" class="w-350 ra-4 pl10 pr10 fs-14 h-35 b-d" type="text">
        <input v-if="info.fileType=='file-url'" v-model="info.fileName" placeholder="请输入网络文件名称" class="w-350 mt10 ra-4 pl10 pr10 fs-14 h-35 b-d" type="text">
        <div class="flex ai-c jc-e">
          <div @click="info.isFile=false;info.fileMsg=''" class="b-e flex ai-c jc-c h-32 fs-14 hand pl10 ra-4 w-60 mt10 pr10">取消</div>
          <div @click="onInsertFile" class="ba-4 flex ai-c jc-c h-32 fs-14 ml10 hand pl10 ra-4 w-60 fc-fff mt10 pr10">确定</div>
        </div>
      </div>
    </div>

    <div id="editorTip" v-show="info.textTip.show" class="flex-line bc-fff ai-c jc-c pp5 ra-5 sha-card abs">
      <div @click="onSetTextStyle('font-weight','bold')" class="flex-line iconf-hover hand pp4  flex ai-c jc-c ra-4 w-23 h-23">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-all" viewBox="0 0 24 24">
          <g fill="none">
            <path
              d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
            <path fill="currentColor" d="M13 3a5 5 0 0 1 3.436 8.633a5 5 0 0 1-2.219 9.363L14 21H6.1a1.1 1.1 0 0 1-1.094-.98L5 19.9V4.1a1.1 1.1 0 0 1 .98-1.094L6.1 3zm1 10H7v6h7a3 3 0 1 0 0-6m-1-8H7v6h6a3 3 0 1 0 0-6" />
          </g>
        </svg>
      </div>
      <div @click="onSetTextStyle('font-style','italic')" class="flex-line iconf-hover hand pp4  flex ai-c jc-c ra-4 ml5 w-23 h-23">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-all" viewBox="0 0 24 24">
          <path fill="currentColor" d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" />
        </svg>
      </div>
      <div @click="onSetTextStyle('text-decoration','underline')" class="flex-line iconf-hover hand pp4  flex ai-c jc-c ra-4 ml5 w-23 h-23">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-all" viewBox="0 0 24 24">
          <path fill="currentColor" d="M5 19h14v2H5zM6 3v8c0 3.31 2.69 6 6 6s6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3z" />
        </svg>
      </div>
      <div @click="onSetTextStyle('text-decoration','line-through')" class="flex-line iconf-hover hand pp4  flex ai-c jc-c ra-4 ml5 w-23 h-23">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-all" viewBox="0 0 16 16">
          <path fill="currentColor" fillRule="evenodd"
            d="M7.886 1a3.136 3.136 0 0 0-2.41 5.144L6.4 7.25H2.75a.75.75 0 0 0 0 1.5h4.899l1.722 2.066A1.636 1.636 0 0 1 8.114 13.5H8a1.75 1.75 0 0 1-1.75-1.75a.75.75 0 0 0-1.5 0A3.25 3.25 0 0 0 8 15h.114a3.136 3.136 0 0 0 2.41-5.144L9.6 8.75h3.649a.75.75 0 0 0 0-1.5H8.351L6.63 5.184A1.636 1.636 0 0 1 7.886 2.5H8c.966 0 1.75.784 1.75 1.75a.75.75 0 0 0 1.5 0A3.25 3.25 0 0 0 8 1z"
            clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref, nextTick, watch, watchEffect } from 'vue';
const editor = ref(null)
const selectedRange = ref(null)
const ps = defineProps({
  exclude: { type: Array, default: [] },
  // (file).then(res=>{ res为url或base64 值 })
  upFile: { type: Function }
})
const innerText = ref("")
const mvalue = defineModel({ type: [String, Number, Object], default: "" });
const info = reactive({
  valueChange: true,
  isFirster: true,
  currtab: '正文',
  show: false,
  colorType: 'fc',
  fullScreen: false,
  fileType: '',
  fileName: '',
  fileUrl: '',
  isFile: false,
  imgModify: false,
  placeholder: '',
  isButtonClick: false,
  fileMsg: '',
  table: {
    x: 0,
    y: 0,
    isResizing: false,
    oldX: 0,
    oldY: 0,
    cellWidth: 0,
    cellHeight: 0,
    width: 0,
    height: 0,
    cell: null,
    resizeType: ""
  },
  textTip: {
    show: false,
    left: 0,
    top: 0
  }
})
watch(() => mvalue.value, (news, old) => {
  if (info.valueChange) {
    innerText.value = mvalue.value;
  }
})
function changeText(e) {
  mvalue.value = e.srcElement.innerHTML;
}
const colors = {
  main: ['#000000', '#ffffff', '#eeece1', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c'],
  hex: [['#7f7f7f', '#f2f2f2'], ['#0d0d0d', '#808080'], ['#1c1a10', '#ddd8c3'], ['#0e243d', '#c6d9f0'], ['#233f5e', '#dae5f0'], ['#632623', '#f2dbdb'], ['#4d602c', '#eaf1de'], ['#3f3150', '#e6e0ec'], ['#1e5867', '#d9eef3'], ['#99490f', '#fee9da']],
  hot: ['#c21401', '#ff1e02', '#ffc12a', '#ffff3a', '#90cf5b', '#00af57', '#00afee', '#0071be', '#00215f', '#72349d'],
}
const colorPlan = ref([])

function onBlur() {
  info.valueChange = true;
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    selectedRange.value = selection.getRangeAt(0); // 保存第一个 Range
  }
}

function onFocus(e) {
  info.valueChange = false;
  if (selectedRange.value && info.isButtonClick) {
    const selection = window.getSelection();
    selection.removeAllRanges(); // 清除当前选区
    selection.addRange(selectedRange.value); // 恢复保存的选区
    info.isButtonClick = false;
  }
}

function onCreateTable(e) {
  if (e.target.dataset.x) {
    const table = document.createElement('table');
    table.style.borderCollapse = "collapse";
    table.style.width = "100%"
    // table.style.userSelect = "none";
    table.style.borderCollapse = "collapse"
    let tableHtml = ""
    for (let i = 0; i < e.target.dataset.x; i++) {
      tableHtml += "<tr>";
      for (let y = 0; y < e.target.dataset.y; y++) {
        tableHtml += "<td style='border:1px solid #ddd;padding:7px 4px;'>&nbsp;</td>";
      }
      tableHtml += "</tr>";
    }
    table.innerHTML = tableHtml;

    editor.value && editor.value.focus();
    setTimeout(() => {
      const selection = window.getSelection() as Selection
      let range = selection.getRangeAt(0)
      if (selectedRange.value) {
        range = selectedRange.value;
      }
      const div = document.createElement('div');
      div.appendChild(table)
      div.appendChild(document.createElement('br'))

      // 插入 blockquote 到光标位置
      range.insertNode(div);

      // 将光标移动到 blockquote 后面
      const newRange = document.createRange();
      newRange.setStartAfter(div);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      onDragTable(table)
    }, 100);
  }
}

function onDragTable(table) {
  Array.from(table.rows).forEach((tr, i) => {
    Array.from(tr.cells).forEach((cell, j) => {
      cell.onmousemove = e => {
        if (e.offsetY > e.target.offsetHeight - 10) {
          cell.style.cursor = 'row-resize';
          return;
        }
        if (e.offsetX > e.target.offsetWidth - 10) {
          cell.style.cursor = 'col-resize';
          return;
        }
        cell.style.cursor = 'default';
      }
      cell.onmousedown = e => {
        if (e.offsetY > (e.target.offsetHeight - 10) || e.offsetX > (e.target.offsetWidth - 10)) {
          info.table.isResizing = true;
        }
        info.table.oldX = e.clientX;
        info.table.oldY = e.clientY;
        info.table.cellWidth = e.target.offsetWidth;
        info.table.cellHeight = e.target.offsetHeight;
        info.table.width = table.offsetWidth;
        info.table.height = table.offsetHeight;
        info.table.cell = cell;
        document.onmousemove = de => {
          de.preventDefault()
          if (info.table.isResizing) {
            Array.from(tr.cells).forEach(item => {
              // 清空当前行其它单元格的高度
              item.style.height = ""
            })
            // 设置第一行对应列的宽度
            table.rows[0].cells[j].style.width = info.table.cellWidth + de.clientX - info.table.oldX + 'px';
            info.table.cell.style.height = info.table.cellHeight + de.clientY - info.table.oldY + 'px';
            table.style.width = info.table.width + de.clientX - info.table.oldX + 'px';
            table.style.height = info.table.height + de.clientY - info.table.oldY + 'px';
          }
        };
        document.onmouseup = de => {
          info.table.isResizing = false;
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    })
  })
}

function changeImage(e) {
  const file = e.target.files[0];
  if (file) {
    // 如果未传upfile方法，直接插入base64图片
    if (!ps.upFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64Image = e.target.result; // 获取 Base64 数据
        let img = insertImage(base64Image); // 插入到编辑区域
        onImageClick(img)
      };
      reader.readAsDataURL(file);
      return;
    }

    let fn = ps.upFile(file);
    // 如果传来的是string 
    if (typeof fn == 'string') {
      let img = insertImage(fn); // 插入到编辑区域
      onImageClick(img)
    } else if (typeof fn == "object") {
      // 调用后台接口Promise返回来的url
      fn.then(res => {
        let img = insertImage(res); // 插入到编辑区域
        onImageClick(img)
      })
    }
  }
}

function changeVideo(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
    // 如果未传upfile方法，直接插入base64图片
    if (!ps.upFile) {
      let video = insertVideo(URL.createObjectURL(file))
      onImageClick(video)
      return
    }

    let fn = ps.upFile(file);
    // 如果传来的是string 
    if (typeof fn == 'string') {
      let video = insertVideo(fn); // 插入到编辑区域
      onImageClick(video)
    } else if (typeof fn == "object") {
      // 调用后台接口Promise返回来的url
      fn.then(res => {
        let video = insertVideo(res); // 插入到编辑区域
        onImageClick(video)
      })
    }
  }
}

function changeFile(e) {
  const file = event.target.files[0]; // 获取用户选择的所有文件
  if (file) {
    // 如果未传upfile方法，直接插入base64图片
    if (!ps.upFile) {
      const fileUrl = URL.createObjectURL(file); // 生成 Blob URL
      insertFile(fileUrl, file.name)
      return;
    }

    let fn = ps.upFile(file);
    // 如果传来的是string 
    if (typeof fn == 'string') {
      insertFile(fn, file.name)
    } else if (typeof fn == "object") {
      // 调用后台接口Promise返回来的url
      fn.then(res => {
        insertFile(res, file.name)
      })
    }
  }
}

function onImageClick(img) {
  img.addEventListener('click', e => {
    img.className = "imageSelect";
    info.imgModify = false;
    let clientX, clientY
    // div可修改的最小宽高
    let minW = 8;
    let minH = 8;
    // 鼠标按下时的位置，使用n、s、w、e表示
    let direc = '';
    editor.value?.blur();
    editor.value.ondragstart = e => { return false }
    editor.value.onselectstart = e => { return false }
    img.focus();
    document.onmousemove = e => {
      let d = getDirection(e, img);
      img.style.cursor = (d === '') ? 'default' : (d + '-resize');
      if (info.imgModify) {
        // 鼠标按下的位置在右边，修改宽度
        if (direc.indexOf('e') !== -1) {
          img.style.width = Math.max(minW, img.offsetWidth + (e.clientX - clientX)) + 'px'
          clientX = e.clientX
        }

        // 鼠标按下的位置在上部，修改高度
        if (direc.indexOf('n') !== -1) {
          img.style.height = Math.max(minH, img.offsetHeight + (clientY - e.clientY)) + 'px'
          clientY = e.clientY
        }
        // 鼠标按下的位置在底部，修改高度
        if (direc.indexOf('s') !== -1) {
          img.style.height = Math.max(minH, img.offsetHeight + (e.clientY - clientY)) + 'px'
          clientY = e.clientY
        }

        // 鼠标按下的位置在左边，修改宽度
        if (direc.indexOf('w') !== -1) {
          img.style.width = Math.max(minW, img.offsetWidth + (clientX - e.clientX)) + 'px'
          clientX = e.clientX
        }
      }
    }
    document.onmouseup = e => {
      if (img) {
        img.style.cursor = "default";
      }
      document.onmousemove = null;

      img.className = ""
      info.imgModify = false;
      editor.value.ondragstart = e => { return true }
      editor.value.onselectstart = e => { return true }
      document.onmouseup = null;
    }
    img.onmousedown = e => {
      let d = getDirection(e, img)
      // 当位置为四个边和四个角时才开启尺寸修改
      if (d !== '') {
        info.imgModify = true;
        direc = d
        clientX = e.clientX
        clientY = e.clientY
      }
      // e.preventDefault()
    }
  })
}

function insertImage(url) {
  const img = document.createElement('img');
  img.src = url;
  img.draggable = true; // 使图片可拖动
  img.style.resize = 'both'; // 使图片可调整大小
  img.style.overflow = 'auto'; // 允许调整大小
  img.style.maxWidth = '100%'; // 限制图片最大宽度
  img.style.cursor = 'move'; // 设置拖动光标
  img.style['-webkit-user-select'] = 'none';
  img.id = new Date().getTime().toString();

  // 在光标位置插入图片
  selectedRange.value.insertNode(img);

  // 将光标移动到图片后面
  const newRange = document.createRange();
  const selection = window.getSelection();
  newRange.setStartAfter(img);
  newRange.setEndAfter(img);
  selection.removeAllRanges();
  selection.addRange(newRange);

  info.fileType = "";
  info.isFile = false;
  return img
}

function insertVideo(url) {
  let div = document.createElement('div')
  div.style.width = "100%"
  const video = document.createElement('video'); // 创建 <video> 元素
  video.src = url;
  video.draggable = true; // 使图片可拖动
  video.style.resize = 'both'; // 使图片可调整大小
  video.style.overflow = 'auto'; // 允许调整大小
  video.style.maxWidth = '100%'; // 限制图片最大宽度
  video.style.cursor = 'move'; // 设置拖动光标
  video.controls = true;
  video.id = new Date().getTime().toString();
  div.appendChild(video)
  div.appendChild(document.createElement('br'))

  // 将视频插入到编辑区域
  selectedRange.value.insertNode(div);
  // 将光标移动到视频后面
  const newRange = document.createRange();
  const selection = window.getSelection();
  newRange.setStartAfter(div);
  newRange.setEndAfter(div);
  newRange.collapse(false)
  selection.removeAllRanges();
  selection.addRange(newRange);
  editor.value.focus();
  info.fileType = "";
  info.isFile = false;
  return video
}

function insertFile(url, name) {
  const link = document.createElement('a');
  link.href = url;
  link.textContent = name; // 显示文件名
  link.download = name; // 设置下载属性
  link.innerHTML = `<span style="color:#0000cc;text-decoration: underline">文件：${name}</span>`
  // 在光标位置插入图片
  selectedRange.value.insertNode(link);

  // 将光标移动到图片后面
  const newRange = document.createRange();
  const selection = window.getSelection();
  newRange.setStartAfter(link);
  newRange.setEndAfter(link);
  selection.removeAllRanges();
  selection.addRange(newRange);

  info.fileType = "";
  info.isFile = false;
}

function onInsertFile() {
  if (info.fileType == 'image-url') {
    if (!/\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(info.fileUrl)) {
      info.fileMsg = '图片路经不正确'
      return
    }
    let img = insertImage(info.fileUrl)
    onImageClick(img)
  } else if (info.fileType == 'video-url') {
    if (!/\.(mp4|webm|ogg|mov|avi)$/i.test(info.fileUrl)) {
      info.fileMsg = '视频路经不正确'
      return
    }
    let video = insertVideo(info.fileUrl)
    onImageClick(video)
  } else {
    if (/\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(info.fileUrl)) {
      let img = insertImage(info.fileUrl)
      onImageClick(img)
      return;
    }
    else if (/\.(mp4|webm|ogg|mov|avi)$/i.test(info.fileUrl)) {
      let video = insertVideo(info.fileUrl)
      onImageClick(video)
      return
    } else {
      // const fileUrl = URL.createObjectURL(file); // 生成 Blob URL
      insertFile(info.fileUrl, info.fileName)
    }
  }

  info.fileType = "";
  info.isFile = false;
}

// 获取鼠标所在对像的位置
function getDirection(ev, c) {
  let xP, yP, offset, dir;
  dir = '';
  xP = ev.offsetX;
  yP = ev.offsetY;
  offset = 10;

  if (yP < offset) dir += 'n';
  else if (yP > c.offsetHeight - offset) dir += 's';
  if (xP < offset) dir += 'w';
  else if (xP > c.offsetWidth - offset) dir += 'e';
  return dir;
}

function colorBox(color = "rgba(255,0,0,1)") {
  const width = 256;
  const ctx = document.getElementById('idColor').getContext("2d");
  const gradientBase = ctx.createLinearGradient(30, 0, width + 30, 0);
  gradientBase.addColorStop(1, color);
  gradientBase.addColorStop(0, "rgba(255,255,255,1)");
  ctx.fillStyle = gradientBase;
  ctx.fillRect(30, 0, width, width);
  // 第二次填充，黑色到透明
  const gradientScreen = ctx.createLinearGradient(0, 0, 0, width);
  gradientScreen.addColorStop(0, "rgba(0,0,0,0)");
  gradientScreen.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = gradientScreen;
  ctx.fillRect(30, 0, width, width);
}

watchEffect(() => {
  if (mvalue.value && !innerText.value) {
    innerText.value = ps.modelValue;
    setTimeout(() => {
      editor.value?.querySelectorAll('table').forEach(table => {
        onDragTable(table)
      })
      editor.value?.querySelectorAll('img').forEach(img => {
        onImageClick(img)
      })
    }, 100);
  }
})

onMounted(() => {
  const width = 256;
  const curColor = "rgba(255,0,0,1)";

  const ctx = document.getElementById('idColor').getContext("2d", { willReadFrequently: true });
  const gradientBar = ctx.createLinearGradient(0, 0, 0, width);
  gradientBar.addColorStop(0, "#f00");
  gradientBar.addColorStop(1 / 6, "#f0f");
  gradientBar.addColorStop(2 / 6, "#00f");
  gradientBar.addColorStop(3 / 6, "#0ff");
  gradientBar.addColorStop(4 / 6, "#0f0");
  gradientBar.addColorStop(5 / 6, "#ff0");
  gradientBar.addColorStop(1, "#f00");
  ctx.fillStyle = gradientBar;
  ctx.fillRect(0, 0, 20, width);
  colorBox()


  document.getElementById('idColor').onclick = e => {
    const coorX = e.offsetX || e.layerX;
    const coorY = e.offsetY || e.layerY;
    const imgData = ctx.getImageData(coorX, coorY, 1, 1);
    const { data } = imgData;
    const rgbaStr = [data[0], data[1], data[2]];
    if (coorX && coorX < 20 && coorY >= 0 && coorY < width) {
      colorBox(`rgba(${rgbaStr.join(",")})`);
    } else {
      onSetColor(rgbaStr.toString())
    }
  }

  editor.value.addEventListener('dragstart', e => {
    if (e.target.tagName == "IMG")
      e.dataTransfer.setData('text/plain', JSON.stringify({ id: e.target.id, typeTage: e.target.tagName }));
  })
  editor.value.addEventListener('drop', e => {
    let data = e.dataTransfer.getData('text/plain')
    if (data?.includes('typeTage') && JSON.parse(data).typeTage == 'IMG') {
      setTimeout(() => {
        onImageClick(document.getElementById(JSON.parse(data).id));
      }, 150);
    }
  })
  editor.value.addEventListener('paste', e => {
    // e.preventDefault();
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let v of items) {
      if (v.type.includes('image')) {
        e.preventDefault();
        const blob = v.getAsFile();

        // 使用 FileReader 读取图片
        const reader = new FileReader();
        reader.onload = (e) => {
          // 创建 img 元素
          const img = document.createElement('img');
          img.src = e.target.result;
          onImageClick(img)

          // 将图片插入到 contenteditable 中
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          range.insertNode(img);

          // 将光标移动到图片后面
          range.setStartAfter(img);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        };
        reader.readAsDataURL(blob); // 将图片转换为 Base64
      }
    }
  })
})

function onTabSet(type) {
  info.textTip.show = false;
  editor.value && editor.value.focus();
  if (info.currtab == type) {
    info.show = !info.show;
  } else {
    info.currtab = type;
    info.show = true
  }
}

function onSetColor(color, close = true) {
  if (info.colorType == 'fc') {
    setSelectRange({ 'color': `rgba(${color})` }, "style", 'span');
  } else {
    setSelectRange({ 'background-color': `rgba(${color})` }, "style", 'span');
  }
  if (close) {
    info.show = false;
    info.currtab = ""
  }

}

function onSetList(e) {
  if (e.target.dataset.value) {
    let selection = window.getSelection();
    // 如果不在列表项中，创建新的有序列表
    const ul = document.createElement(e.target.dataset.value);
    const newLi = document.createElement('li');
    let currDate = Date.now().toString();
    newLi.setAttribute('data-type', e.target.dataset.value);
    newLi.setAttribute('data-name', currDate);
    if (e.target.dataset.value == 'ul') {
      newLi.style.marginLeft = '15px';
      newLi.style.listStyleType = 'inherit';
      newLi.innerHTML = "<span><br></span>"
    } else if (e.target.dataset.value == 'ol') {
      newLi.style.marginLeft = '15px';
      newLi.style.listStyleType = 'inherit';
      newLi.innerHTML = "<span><br></span>"
    } else if (e.target.dataset.value == 'check') {
      newLi.innerHTML = `<input style="height:16px;width:16px;margin-right:5px;" type="checkbox"><span><br></span>`;
    } else if (e.target.dataset.value == 'radio') {
      newLi.innerHTML = `<input name="${currDate}" style="height:16px;width:16px;margin-right:5px;" type="radio"><span><br></span>`;
    }
    ul.appendChild(newLi);
    selectedRange.value.insertNode(ul);

    selectedRange.value.setStart(newLi.lastChild, 0)
    selectedRange.value.setEnd(newLi.lastChild, 0)

    selection.removeAllRanges(); // 清除之前的所有选择范围
    selection.addRange(selectedRange.value);
  }
}

function onOpenFile(e) {
  if (e.target.dataset.value) {
    info.fileType = e.target.dataset.value;
    info.isFile = true;
    if (e.target.dataset.value.includes('url')) {
      info.show = true;
      info.placeholder = '输入网络图片链接';
      if (e.target.dataset.value == 'video-url') {
        info.placeholder = '输入网络视频链接';
      } else if (e.target.dataset.value == 'file-url') {
        info.placeholder = '输入网络文件链接';
      }
    }
  }
}



function onTextAlign(e) {
  if (e.target.dataset.value) {
    setSelectRange({ 'text-align': e.target.dataset.value }, "style", 'span');
  }
}

function onLineHeight(e) {
  if (e.target.dataset.value) {
    setSelectRange({ 'line-height': (Number(e.target.dataset.value) + 8) + 'px' }, "style", 'span');
  }
}

// 设置正文
function onSetHtitle(e) {
  setSelectRange("", "", e.target.tagName);
}

function onSetTextStyle(style, value) {
  setSelectRange({ [style]: value }, "style", 'span');
}

// 设置字体大小
function onSetFontSize(e) {
  if (e.target.getAttribute('data')) {
    setSelectRange({ 'font-size': (Number(e.target.getAttribute('data')) + 8) + 'px' }, "style", 'span');
  }
}

// 设置字体
function onFontFamily(e) {
  if (e.target.getAttribute('data')) {
    setSelectRange({ 'font-family': e.target.getAttribute('data') }, "style", 'span');
  } else {
    // 默认字体
    // 清空选区
    const selection = window.getSelection();
    const text = selectedRange.value.toString(); // 获取选中文本
    const textNode = document.createTextNode(text); // 创建纯文本节点
    selectedRange.value.deleteContents(); // 删除选中内容
    selectedRange.value.insertNode(textNode); // 插入纯文本节点

    // 重新设置选区
    const newRange = document.createRange();
    newRange.selectNodeContents(textNode);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

function onMousedown(e) {
  info.show = false;
  info.currtab = "";
}

function onsMouseup(e) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();



  if (range.toString().replace(/\s/g, '')) {
    let edi = document.getElementById('editorYuyue');
    let tip = document.getElementById('editorTip');
    info.textTip.show = true;
    nextTick(() => {
      tip.style.left = rect.left + (rect.width / 2) - edi.offsetLeft - (tip.offsetWidth / 2) + 'px';
      tip.style.top = rect.top - edi.offsetTop + rect.height + 'px';
    })

  } else {
    info.textTip.show = false;
  }
}

function onKeydown(e) {
  if (e.key == 'Enter') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    let dom = isListULorOl(range, 'BLOCKQUOTE')
    if (range.startContainer.nodeName == "BLOCKQUOTE" && dom.node == editor.value) {
      e.preventDefault()
      editor.value.removeChild(range.startContainer);
      const br = document.createElement('br');
      range.insertNode(br);
      // 将光标移动到 <br> 后面
      range.setStartAfter(br);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    if (range.startContainer.nodeName == "BLOCKQUOTE" && dom.node.nodeName == 'BLOCKQUOTE') {
      e.preventDefault()
      dom.node.removeChild(range.startContainer)
    }
  }
}

function onKeydownDemo(e) {
  if (e.key == 'Enter') {

    // 阻止默认行为
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const { startContainer, startOffset } = range;
    // 判断是否为行尾
    const isAtEndOfLine = isCursorAtEndOfLine(startContainer, startOffset, range);

    const li = range.startContainer.parentElement;
    let currLi = isListULorOl(range) || { isLi: false };
    console.log(range.extractContents().firstChild, range.commonAncestorContainer.outerHTML, range.commonAncestorContainer.nodeName,);

    // 行尾换行需处理不带格式与标签，新行换行
    if (currLi.isLi && (range.commonAncestorContainer.nodeName == "#text" || (range.commonAncestorContainer.outerHTML && range.commonAncestorContainer.outerHTML != '<span><br></span>'))) {
      console.log(currLi.node.textContent);

      e.preventDefault();
      // 如果不在列表项中，创建新的有序列表
      const newLi = document.createElement('li');
      newLi.setAttribute('data-type', currLi.node.dataset.type);
      newLi.setAttribute('data-name', currLi.node.dataset.name);
      const fragment = range.extractContents();
      if (currLi.node.dataset.type == 'ul') {
        newLi.style.marginLeft = '15px';
        newLi.style.listStyleType = 'inherit';
        newLi.innerHTML = "<span><br></span>"
        newLi.appendChild(extractContents)
      } else if (currLi.node.dataset.type == 'ol') {
        newLi.style.marginLeft = '15px';
        newLi.style.listStyleType = 'inherit';
        newLi.innerHTML = "<span><br></span>"
      } else if (currLi.node.dataset.type == 'check') {
        newLi.innerHTML = `<input style="height:16px;width:16px;margin-right:5px;" type="checkbox"><span><br></span>`;
      } else if (currLi.node.dataset.type == 'radio') {
        newLi.innerHTML = `<input name="${currLi.node.dataset.name}" style="height:16px;width:16px;margin-right:5px;" type="radio"><span><br></span>`;
      }

      // currLi.node.
      currLi.node.insertAdjacentElement('afterend', newLi);

      // currLi.node.parentElement.appendChild(newLi);
      // 将光标移动到新列表项
      const newRange = document.createRange();
      newRange.setStart(newLi.lastChild, 0);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
      return
    }



    if (isAtEndOfLine) {
      console.log('=========222222========');
      let topLevelNode = range.commonAncestorContainer;
      while (topLevelNode.parentNode && topLevelNode.parentNode !== editor.value) {
        topLevelNode = topLevelNode.parentNode;
      }
      const newDiv = document.createElement('div');
      newDiv.innerHTML = '<br>';

      topLevelNode.parentNode.insertBefore(newDiv, topLevelNode.nextSibling);
      range.setStart(newDiv, 0);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range)
      editor.value.normalize();
      // 如果从列表换行出来的，需要删除最后一个li节点
    } else {
      if (currLi.isLi && range.commonAncestorContainer.outerHTML == '<span><br></span>' && currLi.node.contentEditable != "true") {
        e.preventDefault();
        if (currLi.node.parentElement.childNodes.length == 1) {
          currLi.node.parentNode.remove();
        } else {
          currLi.node.remove();
        }
        console.log('=========3333333========');
        const br = document.createElement('br');
        range.insertNode(br);
        // 将光标移动到 <br> 后面
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
}

// 是否包含在ul ol列表内
function isListULorOl(range, dom = "LI") {
  let topLevelNode = range.commonAncestorContainer;
  let isLi = range.commonAncestorContainer.nodeName == dom;
  if (range.commonAncestorContainer == editor.value) {
    return { isLi, node: topLevelNode };
  }
  if (topLevelNode.parentNode == dom) {
    return { isLi, node: topLevelNode };
  }
  while (topLevelNode.parentNode) {
    topLevelNode = topLevelNode.parentNode;
    if (topLevelNode.contentEditable == 'true') {
      break
    }
    if (topLevelNode.nodeName == dom) {
      isLi = true;
      break
    }
  }
  return { isLi, node: topLevelNode };
}

/**
 * 判断光标是否在行尾
 * @param {Node} node - 光标所在的节点
 * @param {number} offset - 光标的偏移量
 * @returns {boolean} - 是否为行尾
 */
function isCursorAtEndOfLine(node, offset, range) {
  if (range.commonAncestorContainer == editor.value) {
    return false
  }
  if (node.nodeType === Node.TEXT_NODE) {
    // 如果是文本节点，检查偏移量是否等于文本长度
    return offset === node.length;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // 如果是元素节点，检查光标是否在最后一个子节点之后
    return offset === node.childNodes.length;
  } else if (range.commonAncestorContainer == editor.value) {
    return false
  }
  return false;
}

function onYinYong(e) {
  info.textTip.show = false;
  editor.value && editor.value.focus();
  setTimeout(() => {
    const selection = window.getSelection() as Selection
    let range = selection.getRangeAt(0)
    if (selectedRange.value) {
      range = selectedRange.value;
    }
    const blockquote = document.createElement('blockquote');
    blockquote.style.borderLeft = "4px solid #ccc";
    blockquote.style.margin = "5px 0";
    blockquote.style.backgroundColor = "#f5f5f5"
    blockquote.style.padding = "15px 10px"
    blockquote.innerHTML = "<br>"; // 设置引用内容

    // 插入 blockquote 到光标位置
    range.insertNode(blockquote);

    // 将光标移动到 blockquote 后面
    const newRange = document.createRange();
    newRange.setStartAfter(blockquote.firstChild);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);
  }, 100);
}

function getStyleCss(style, value) {
  let obj = {};
  style.split(';').forEach(item => {
    obj[item.split(':')[0]] = item.split(':')[1];
  })
  if (Object.keys(value).some(v => Object.keys(obj).includes(v))) {
    return ""
  }
  return obj
}

function setSelectRange(value, type = 'style', dom = 'span') {
  let range = selectedRange.value;
  let selection = window.getSelection();

  const selectedText = range.toString();
  if (!selectedText) return;

  if (range.startContainer.nodeName != "#text" && range.startContainer.style.cssText) {
    let more = getStyleCss(range.startContainer.style.cssText, value)
    if (more) {
      value = Object.assign(value, more)
      range.startContainer.remove()
    }
  }

  // 创建一个新的 span 元素并包裹选中的文本
  const spans = document.createElement(dom);
  if (type == 'style' && Object.keys(value).length) {
    for (let item in value) {
      spans.style[item] = value[item];
    }
  } else if (type == 'attr') {
    spans[dom] = value;
  } else if (type == 'html') {
    spans.innerHTML = value;
    range.insertNode(spans.firstChild);
    console.log(spans);
    return;
  }

  spans.textContent = selectedText;

  // 将新的 span 插入到选中范围
  range.deleteContents(); // 清空原有内容
  range.insertNode(spans);
  selection.removeAllRanges();
  const newRange = document.createRange();
  // newRange.setStart(spans, 0);
  // newRange.setEnd(spans, selectedText.length)
  newRange.selectNodeContents(spans)
  // newRange.collapse(false);
  selection.addRange(newRange);
  editor.value.focus()
  mvalue.value = editor.value.innerHTML;
}

function removeFocus() {
  const activeElement = document.activeElement;
  if (activeElement && activeElement.blur) {
    activeElement.blur(); // 移除焦点
  }
}

function restoreSelection() { //重置为上个range
  var selection: any = window.getSelection();
  if (selectedRange.value) {
    try {
      selection.removeAllRanges();
    } catch (ex) {
      (document.body as any).createTextRange().select();
      (document as any).selection.empty();
    };
    selection.addRange(selectedRange.value);
  }
  editor.value?.focus();
}
</script>

<style lang='less'>
// https://www.joy-read.com/css/yuyue-DKjoRxmA.css
.editor-body {
  .no-select {
    user-select: none; /* 标准语法 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer 10+ */
  }
  .imageSelect {
    border: 3px dashed #00afee !important;
    position: relative;
    z-index: 10;
    cursor: move; /* 显示移动光标 */
    resize: both; /* 允许在水平和垂直方向上调整大小 */
    overflow: auto; /* 确保在调整大小时内容不会溢出 */
    &:after {
      z-index: 50;
      display: inline-block;
      position: absolute;
      bottom: -1px;
      right: -1px;
      content: " ";
      width: 0;
      height: 0;
      border-width: 15px 15px 0 0;
      border-style: solid;
      border-color: transparent #00afee transparent transparent;
    }
  }
  .bc-f5f6f7 {
    background-color: #f5f6f7;
  }
  .custom-scrollbar {
    overflow-y: auto; /* 垂直滚动 */
    overflow-x: hidden; /* 隐藏水平滚动 */
    &::-webkit-scrollbar {
      width: 12px;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border: 3px solid #fff;
      border-radius: 6px;
    }
  }
  .iconf-hover {
    &:hover {
      background-color: #f5f6f7;
      font-weight: bold;
    }
  }
  .hover-item {
    padding: 6px 10px;
    margin: 0;
    height: 35px;
    color: #666;
    -webkit-user-select: none;
    &:hover {
      background-color: #f8f8f8;
      font-weight: bold;
    }
  }
  .ft-filte {
    // text-shadow: 0px 0px 1px #8f8f8f;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
  .ft-bg {
    background: linear-gradient(-1deg, #22a5ea, hsla(0, 0%, 100%, 0));
    border-radius: 4px;
  }
  .item-list {
    // item-list pr1 ml5
    margin-top: 5px;
    font-size: 12px;
    background-color: #f5f6f7;
    padding-left: 7px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 3px;
    position: relative;
    .tip-item {
      display: none;
    }
    &:hover {
      .tip-item {
        display: flex;
      }
    }
  }
}
.selected-range {
  &::selection {
    background-color: #94cfff;
  }
}
</style>