import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import * as qiniu from 'qiniu-js'
import {CODES} from "@/utils/code";
import { imageToken } from '@/api/public/index';
import { localStorage } from '@/utils/storage';

const myTools = defineStore({
  id: 'my',
  state :() => (
    {
    }
  ),
  actions: {
    reminder(message ?: string) {
      // @ts-ignore
      ElMessage.error(message || '系统出错');
    },
    ok(message ?: string) {
      // @ts-ignore
      ElMessage.success(message);
    },
    upImage(file:any, type : number, callback : any) {
      let fileInfo = file.name.split('.')
      let fileType = fileInfo[fileInfo.length-1]
      imageToken().then(res => {
        // @ts-ignore
        if (res.code === CODES.ok.code) {
          this._upImage(file, res.data,
            this._getFileName(type, fileType), callback)
        } else {
          // @ts-ignore
          this.reminder(res.message);
        }
      });
    },
    _upImage(file : any, upInfo : object, fineName : string, callback:any) {
      let obj = this
      const observer = {
        state: undefined,
        next(res: any){
        },
        error(err: any){
          obj.reminder('上传失败');
        },
        complete(res: any){
          // @ts-ignore
          callback(upInfo.url + res.key, res.key)
        }
      }
      let config = {
        useCdnDomain: true,//是否使用CDN加速域名
        disableStatisticsReport: true,//是否禁用日志报告
        retryCount: 6//上传自动重试次数
      };
      let putExtra = {
        customVars: {}
      };

      const options = {
        quality: 0.92,
        noCompressIfLarger: true
      }
      // qiniu.compressImage(file, options).then(data => {
        // @ts-ignore
        const observable = qiniu.upload(file, fineName, upInfo.token, putExtra, config)
        observable.subscribe(observer) // 上传开始
      // })
    },
    _getFileName(type : any, fileType:string) {
      let date=new Date();
      let year=date.getFullYear(); //获取当前年份
      let mon=date.getMonth()+1; //获取当前月份
      let da=date.getDate(); //获取当前日
      let h=date.getHours(); //获取小时
      let m=date.getMinutes(); //获取分钟
      let s=date.getSeconds(); //获取秒
      let hs=date.getMilliseconds(); //获取毫秒
      let rand = Math.random()
      // @ts-ignore
      rand = parseInt(rand * 1000)

      // @ts-ignore
      return (CODES.imageType[type] ?? '') + '/' + year + '/' + mon + '/' +
        da + '/' + h + m + s + hs + rand + '.' + fileType
    }
  },
});

export default myTools;
