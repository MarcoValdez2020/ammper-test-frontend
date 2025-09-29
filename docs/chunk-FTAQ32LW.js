import{ca as O,d as z,da as i,f as N,g as x,ga as B,ja as I}from"./chunk-QGAU5XD6.js";import{$a as s,Fb as F,Ha as T,Ia as _,Ka as k,La as m,O as b,P as h,T as v,Va as l,a as w,ab as C,b as j,bb as M,ib as S,ka as d,mb as D,nb as R,ob as Q,pb as f,rb as u,sb as y,va as r,wb as E,xb as c}from"./chunk-VS4GB3SB.js";var X=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;var A={root:{position:"relative"}},H={root:({instance:e})=>["p-skeleton p-component",{"p-skeleton-circle":e.shape==="circle","p-skeleton-animation-none":e.animation==="none"}]},q=(()=>{class e extends B{name="skeleton";theme=X;classes=H;inlineStyles=A;static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275prov=b({token:e,factory:e.\u0275fac})}return e})();var G=(()=>{class e extends I{styleClass;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=v(q);get containerStyle(){let t=this._componentStyle?.inlineStyles.root,o;return this.size?o=j(w({},t),{width:this.size,height:this.size,borderRadius:this.borderRadius}):o=j(w({},t),{width:this.width,height:this.height,borderRadius:this.borderRadius}),o}static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275cmp=T({type:e,selectors:[["p-skeleton"]],hostVars:7,hostBindings:function(o,n){o&2&&(l("aria-hidden",!0)("data-pc-name","skeleton")("data-pc-section","root"),E(n.containerStyle),c(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[F([q]),k],decls:0,vars:0,template:function(o,n){},dependencies:[x,i],encapsulation:2,changeDetection:0})}return e})(),he=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=_({type:e});static \u0275inj=h({imports:[G,i,i]})}return e})();var L=`
    .p-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: dt('toolbar.padding');
        background: dt('toolbar.background');
        border: 1px solid dt('toolbar.border.color');
        color: dt('toolbar.color');
        border-radius: dt('toolbar.border.radius');
        gap: dt('toolbar.gap');
    }

    .p-toolbar-start,
    .p-toolbar-center,
    .p-toolbar-end {
        display: flex;
        align-items: center;
    }
`;var J=["start"],K=["end"],U=["center"],W=["*"];function Y(e,p){e&1&&S(0)}function Z(e,p){if(e&1&&(C(0,"div"),m(1,Y,1,0,"ng-container",1),M()),e&2){let t=D();c(t.cx("start")),l("data-pc-section","start"),r(),s("ngTemplateOutlet",t.startTemplate||t._startTemplate)}}function $(e,p){e&1&&S(0)}function ee(e,p){if(e&1&&(C(0,"div"),m(1,$,1,0,"ng-container",1),M()),e&2){let t=D();c(t.cx("center")),l("data-pc-section","center"),r(),s("ngTemplateOutlet",t.centerTemplate||t._centerTemplate)}}function te(e,p){e&1&&S(0)}function ne(e,p){if(e&1&&(C(0,"div"),m(1,te,1,0,"ng-container",1),M()),e&2){let t=D();c(t.cx("end")),l("data-pc-section","end"),r(),s("ngTemplateOutlet",t.endTemplate||t._endTemplate)}}var oe={root:()=>["p-toolbar p-component"],start:"p-toolbar-start",center:"p-toolbar-center",end:"p-toolbar-end"},V=(()=>{class e extends B{name="toolbar";theme=L;classes=oe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275prov=b({token:e,factory:e.\u0275fac})}return e})();var ae=(()=>{class e extends I{styleClass;ariaLabelledBy;_componentStyle=v(V);getBlockableElement(){return this.el.nativeElement.children[0]}startTemplate;endTemplate;centerTemplate;templates;_startTemplate;_endTemplate;_centerTemplate;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"start":case"left":this._startTemplate=t.template;break;case"end":case"right":this._endTemplate=t.template;break;case"center":this._centerTemplate=t.template;break}})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275cmp=T({type:e,selectors:[["p-toolbar"]],contentQueries:function(o,n,g){if(o&1&&(f(g,J,4),f(g,K,4),f(g,U,4),f(g,O,4)),o&2){let a;u(a=y())&&(n.startTemplate=a.first),u(a=y())&&(n.endTemplate=a.first),u(a=y())&&(n.centerTemplate=a.first),u(a=y())&&(n.templates=a)}},hostAttrs:["data-pc-section","root","data-pc-name","toolbar","role","toolbar"],hostVars:3,hostBindings:function(o,n){o&2&&(l("aria-labelledby",n.ariaLabelledBy),c(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy"},features:[F([V]),k],ngContentSelectors:W,decls:4,vars:3,consts:[[3,"class",4,"ngIf"],[4,"ngTemplateOutlet"]],template:function(o,n){o&1&&(R(),Q(0),m(1,Z,2,4,"div",0)(2,ee,2,4,"div",0)(3,ne,2,4,"div",0)),o&2&&(r(),s("ngIf",n.startTemplate||n._startTemplate),r(),s("ngIf",n.centerTemplate||n._centerTemplate),r(),s("ngIf",n.endTemplate||n._endTemplate))},dependencies:[x,z,N,i],encapsulation:2,changeDetection:0})}return e})(),Ne=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=_({type:e});static \u0275inj=h({imports:[ae,i,i]})}return e})();export{G as a,he as b,ae as c,Ne as d};
