import api from './webapi';
import { defineStore } from 'pinia';
import yy from '@lib/mixin';
const { ipcRenderer } = window['require']('electron');

function storage(key: any, value: any = "", type: any = "") {
  if (type) {
    localStorage.removeItem(key);
    return;
  } else {
    if (!!value) {
      return localStorage.setItem(key, JSON.stringify(value));
    } else {
      let val = localStorage.getItem(key) || "";
      return (val && JSON.parse(val)) || "";
    }
  }
}
// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export default defineStore('main', {
  state: () => {
    let audio: any;
    return {
      isAdmin: true,
      gonlishu: storage("gonlishu") || 0,
      ttsConfig: storage('ttsConfig'),
      voiceList: storage('voiceList'),
      nameList: storage('nameList'),
      screenList: [],
      isScreen: false,
      isConfig: false,//全局设置
      play: {
        url: "",
      },
      heji: {},
      isPic: '',
      audio: audio
    }
  },
  actions: {
    speek(data) {
      if (!data.length) {
        yy.msg({ message: '单词或文本不为空！', type: "error" });
        return
      }
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      console.log(data,this.ttsConfig);
      
      ipcRenderer.invoke('tts-speek', { message: data, ...this.ttsConfig }).then(res => {
        let blob: any = new Blob(res, { type: 'audio/webm' })
        this.audio = new Audio(URL.createObjectURL(blob));
        this.audio.play()
        blob = null;
      })
    },
    run(data) {
      return ipcRenderer.invoke('mysql');
    },
  },
})