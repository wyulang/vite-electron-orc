import api from './webapi';
import { defineStore } from 'pinia';
import yy from '@lib/mixin';

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
    return {
      isAdmin: true,
      gonlishu: storage("gonlishu") || 0,
      ttsConfig: storage('ttsConfig'),
      voiceList: storage('voiceList'),
      nameList: storage('nameList'),
      play: {
        url: "",
      },
      heji: {}
    }
  },
  actions: {
    speek(data) {
      if (!data.length) {
        yy.msg({ message: '单词或文本不为空！', type: "error" });
        return
      }
      const { ipcRenderer } = window['require']('electron');
      ipcRenderer.invoke('tts-speek', { message: data, ...this.ttsConfig }).then(res => {
        const blob = new Blob(res, { type: 'audio/webm' })
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play()
      })
    }
  },
})