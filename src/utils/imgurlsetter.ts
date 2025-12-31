export const imageset = (url:string)=>{
  if(url.substring(0,4)=='http')return url
  else return "https://image.api.azzurenest.com/images/"+url
}