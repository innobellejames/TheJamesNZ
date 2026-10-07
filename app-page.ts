import {isEditor} from './permissions';
export const dynamic='force-dynamic';
export default async function Page(){const editor=await isEditor();return <iframe src={'/family-update/index.html?v=20261007i-complete&editor='+(editor?'1':'0')} title="The James NZ" allow="microphone; web-share" style={{position:'fixed',inset:0,width:'100%',height:'100dvh',border:0,zIndex:1000,background:'#fff'}}/>;}
