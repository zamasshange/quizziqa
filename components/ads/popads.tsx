/**
 * Single official PopAds snippet (one adcode per page).
 * Includes CDATA markers required by PopAds validation.
 */
const POPADS_SNIPPET = `/*<![CDATA[/* */
(function(){var e=window,k="e83cd509981011e40e1a02a5b440bafe",a=[["siteId",341-121*997+5433221],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],i=["d3d3LmFudGlhZGJsb2Nrc3lzdGVtcy5jb20vbHRpbWVtZS5taW4uY3Nz","ZDNjb2Q4MHRobjdxbmQuY2xvdWRmcm9udC5uZXQvbGxmYVEvenNpZGViYXIubWluLmpz"],y=-1,p,r,z=function(){clearTimeout(r);y++;if(i[y]&&!(1809896834000<(new Date).getTime()&&1<y)){p=e.document.createElement("script");p.type="text/javascript";p.async=!0;var j=e.document.getElementsByTagName("script")[0];p.src="https://"+atob(i[y]);p.crossOrigin="anonymous";p.onerror=z;p.onload=function(){clearTimeout(r);e[k.slice(0,16)+k.slice(0,16)]||z()};r=setTimeout(z,5E3);j.parentNode.insertBefore(p,j)}};if(!e[k]){try{Object.freeze(e[k]=a)}catch(e){}z()}})();
/*]]>/* */`;

export function PopAds() {
  if (process.env.NEXT_PUBLIC_POPADS_ENABLED === "false") {
    return null;
  }

  // Plain <script> once in HTML — do not also load /popads.js or next/script mirrors
  return (
    <script
      type="text/javascript"
      data-cfasync="false"
      dangerouslySetInnerHTML={{ __html: POPADS_SNIPPET }}
    />
  );
}
