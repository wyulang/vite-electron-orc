import axios from 'axios';
import { ipcMain } from "electron";


function getVideoList(text, page) {
  return axios.get(`https://m.baidu.com/sf/vsearch`, {
    params: {
      word: text,
      pd: "video",
      tn: "vsearch",
      atn: "index",
      biz_params: { "isDouble": 1 },
      pn: page || 10,
      data_type: "json",
      mod: 5,
      p_type: 1,
      rn: 100,
      lid: 8538717361249378774,
      main_srcid: 4185
    }
  }).then(res => {
    return res.data;
  })
}
// 视频地址
// 

ipcMain.handle('baidu-video', async (e, data) => {
  return getVideoList(data.serchText, data.page)
})

ipcMain.handle('baidu-video-heji', async (e, data) => {
  return axios.get(`https://m.baidu.com/video/dsp/hejilist`, {
    params: {
      pd: 'video_compilation',
      resource_id: 5376,
      atn: 'index',
      compilationId: data.compilationId,
      hejiNid: data.hejiNid,
      page_type: 2,
      pn: data.page,
      rn: 10,
      top: { "sfhs": 1 },
      frsrcid: data.frsrcid,
      lid: data.lid,
      referlid: data.referlid,
      data_type: 'json'
    }
  }).then(res => {
    return res.data;
  })
})