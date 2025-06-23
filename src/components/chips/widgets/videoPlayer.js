import ReactPlayer from 'react-player';


const isVideoLink = (url) => {
    return ReactPlayer.canPlay(url);
};


const RenderLink = ({url}) => {
    if (isVideoLink(url)) {
      return <div className="mr-4 mt-3 h-40 rounded-lg overflow-hidden">
       <ReactPlayer url={url} controls width="100%" height="100%" />
      </div>
    }
    return <div className=" rounded-lg mr-3 mt-2">
    <a href={url} className="text-metaLink text-Link text-sm font-light font-inter">{url.length > 100 ? `${url.substring(0, 100)}...` : url}</a>
    </div>
};


export default RenderLink;