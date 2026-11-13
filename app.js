// Paper-fold kinetics and ink metrics from the accepted Hub 4.1.
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const metricCanvas = document.createElement('canvas').getContext('2d');
  const baselineStyle = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
  const noteSources = new WeakMap();
  function copySlice(source, start, end) {
    const walker = document.createTreeWalker(source,NodeFilter.SHOW_TEXT), nodes=[];
    let node,position=0;
    while ((node=walker.nextNode())) {nodes.push({node,start:position});position+=node.length;}
    const point = offset => {
      const item = [...nodes].reverse().find(item=>item.start<=offset);
      return [item.node,Math.min(item.node.length,offset-item.start)];
    };
    const range=document.createRange();range.selectNodeContents(source);
    range.setStart(...point(start));range.setEnd(...point(end));
    return range.cloneContents();
  }
  function paragraphCopy(fragment) {
    const source=document.createElement('div'), result=document.createDocumentFragment();
    source.append(fragment);
    const copy=source.textContent, breaks=[...copy.matchAll(/\n+/g)];
    let start=0;
    for (const boundary of [...breaks,{index:copy.length,0:''}]) {
      let from=start,to=boundary.index;
      while(from<to && /\s/.test(copy[from]))from++;
      while(to>from && /\s/.test(copy[to-1]))to--;
      if(to>from){const p=document.createElement('p');p.append(copySlice(source,from,to));result.append(p);}
      start=boundary.index+boundary[0].length;
    }
    return result;
  }
  function balanceNotes(notes) {
    const blocks=[...notes.querySelectorAll('.section-note')];
    if(blocks.length!==2)return;
    const compact=matchMedia('(max-width:680px), (min-width:681px) and (max-width:1024px) and (orientation:portrait)').matches;
    const signature=notes.offsetWidth+'|'+getComputedStyle(blocks[0].querySelector('p')).fontSize+'|'+compact;
    if(notes.dataset.balanceSignature===signature)return;
    if(!noteSources.has(notes)){
      const source=document.createElement('div');
      const originalSplit=blocks[0].textContent.length;
      blocks.forEach((block,index)=>{
        if(index)source.append(document.createTextNode('\n\n'));
        [...block.querySelectorAll('p')].forEach((paragraph,pIndex)=>{
          if(pIndex)source.append(document.createTextNode('\n\n'));
          [...paragraph.childNodes].forEach(node=>source.append(node.cloneNode(true)));
        });
      });
      noteSources.set(notes,{source,originalSplit});
    }
    const {source,originalSplit}=noteSources.get(notes),copy=source.textContent;
    const render=split=>{
      let end=split,start=split;
      while(end && /\s/.test(copy[end-1]))end--;
      while(start<copy.length && /\s/.test(copy[start]))start++;
      blocks[0].replaceChildren(paragraphCopy(copySlice(source,0,end)));
      blocks[1].replaceChildren(paragraphCopy(copySlice(source,start,copy.length)));
      return Math.abs(blocks[0].offsetHeight-blocks[1].offsetHeight);
    };
    let best=originalSplit,difference=render(best);
    if(!compact){
      const boundaries=[...copy.matchAll(/[.!?](?:[»”"])?\s+|\n+/g)].map(match=>match.index+match[0].length).filter(index=>copy.slice(index).trim());
      for(const split of boundaries){const delta=render(split);if(delta<difference){difference=delta;best=split;}}
    }
    render(best);notes.dataset.balanceSignature=signature;notes.dataset.balanceDifference=String(difference);
  }
  function setPixels(element, name, value) {
    const next = value.toFixed(4) + 'px';
    if (element.style.getPropertyValue(name) !== next) element.style.setProperty(name, next);
  }
  // Range rows locate the baselines; Canvas supplies the painted letter bounds,
  // including both lower text columns.
  function measureTextInk(element) {
    if (!element?.getClientRects().length) return null;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const rows = new Map(), flat = new WeakMap();
    const range = document.createRange();
    let node, lastRect;
    // A paragraph's visual line order is monotone only in ordinary horizontal
    // text. Preserve the original glyph walk for unusual scripts/transforms.
    function flatFlow(el) {
      if (!el) return true;
      if (flat.has(el)) return flat.get(el);
      const css = getComputedStyle(el), transform = css.transform;
      let own = css.writingMode === 'horizontal-tb' &&
        !(parseInt(css.columnCount,10)>1) && css.columnWidth === 'auto';
      if (own && transform !== 'none') {
        const match = /^matrix\(([^)]+)\)$/.exec(transform);
        const m = match?.[1].split(',').map(Number);
        own = !!m && m.length===6 && Math.abs(m[1])<1e-10 &&
          Math.abs(m[2])<1e-10 && m[0]>0 && m[3]>0;
      }
      const result = own && flatFlow(el.parentElement);
      flat.set(el,result); return result;
    }
    function addRow(rect,text) {
      if (!rect.height || !text) return;
      const key=rect.top.toFixed(2),row=rows.get(key)||{top:rect.top,text:''};
      row.text+=text;rows.set(key,row);
    }
    while ((node = walker.nextNode())) {
      const text=node.data;
      if (!/\S/u.test(text)) continue;
      const complex=/[^\u0000-\u02ff\u0400-\u052f\u2000-\u2065\u2070-\u209f]|[\u00ad\u200b-\u200f\u202a-\u202e\u2060-\u206f]/u.test(text);
      if (complex || !flatFlow(node.parentElement)) {
        for (let index=0;index<node.length;index++) {
          if (/\s/.test(text[index])) continue;
          range.setStart(node,index);range.setEnd(node,index+1);
          const rect=range.getBoundingClientRect();
          if (!rect.height) continue;
          addRow(rect,text[index]);lastRect=rect;
        }
        continue;
      }
      const glyphs=Array.from(text.matchAll(/\S/gu));
      const cached=new Map();
      const boxAt=index=>{
        if (!cached.has(index)) {
          const glyph=glyphs[index];range.setStart(node,glyph.index);
          range.setEnd(node,glyph.index+glyph[0].length);
          cached.set(index,range.getBoundingClientRect());
        }
        return cached.get(index);
      };
      const finalBox=boxAt(glyphs.length-1);
      if (!finalBox.height) continue;
      let start=0;
      while(start<glyphs.length) {
        const firstBox=boxAt(start);
        if (!firstBox.height) {start++;continue;}
        const top=Number(firstBox.top.toFixed(2));
        let end=glyphs.length;
        if (Number(finalBox.top.toFixed(2))!==top) {
          // Locate the next line in log(n) geometry reads, rather than asking
          // the browser for every individual character's rectangle.
          let lo=start+1,hi=glyphs.length;
          while(lo<hi) {
            const mid=(lo+hi)>>>1;
            if(Number(boxAt(mid).top.toFixed(2))<=top)lo=mid+1;
            else hi=mid;
          }
          end=lo;
        }
        addRow(firstBox,glyphs.slice(start,end).map(g=>g[0]).join(''));
        start=end;
      }
      lastRect=finalBox;
    }
    if (!lastRect) return null;
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden','true'); probe.style.cssText = baselineStyle;
    element.append(probe);
    const baselineOffset = probe.getBoundingClientRect().top - lastRect.top;
    probe.remove();
    const style = getComputedStyle(element);
    metricCanvas.font = [style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
    let top = Infinity, bottom = -Infinity;
    for (const row of rows.values()) {
      const ink = metricCanvas.measureText(row.text);
      top = Math.min(top,row.top+baselineOffset-ink.actualBoundingBoxAscent);
      bottom = Math.max(bottom,row.top+baselineOffset+ink.actualBoundingBoxDescent);
    }
    const box = element.getBoundingClientRect();
    element.dataset.inkTopInset = (top-box.top).toFixed(4);
    element.dataset.inkBottomInset = (box.bottom-bottom).toFixed(4);
    return {top,bottom};
  }
  let inkEpoch=0;const inkCache=new WeakMap();
  document.fonts.ready.then(()=>inkEpoch++);document.fonts.addEventListener('loadingdone',()=>inkEpoch++);
  function textInk(element){
    if(!element?.getClientRects().length)return null;
    const box=element.getBoundingClientRect(),style=getComputedStyle(element);
    const key=[box.width.toFixed(3),box.height.toFixed(3),element.textContent,style.font,style.letterSpacing,style.whiteSpace,inkEpoch].join('|');
    const cached=inkCache.get(element);
    if(cached?.key===key)return {top:box.top+cached.top,bottom:box.top+cached.bottom};
    const result=measureTextInk(element);
    if(result)inkCache.set(element,{key,top:result.top-box.top,bottom:result.bottom-box.top});
    return result;
  }
  function notesInk(notes) {
    const bounds = [...notes.querySelectorAll('p')].map(textInk).filter(Boolean);
    return {top:Math.min(...bounds.map(box=>box.top)),bottom:Math.max(...bounds.map(box=>box.bottom))};
  }
  function alignFooterGap(scope) {
    const notes = scope?.querySelector('.section-notes');
    const footer = scope?.querySelector('.panel-contact-row,.panel-route-row');
    if (!notes || !footer || !notes.offsetWidth) return;
    const bounds = notesInk(notes);
    const gap = parseFloat(getComputedStyle(scope).getPropertyValue('--section-block-gap')) || 25;
    const inset = notes.getBoundingClientRect().bottom - bounds.bottom;
    setPixels(footer,'margin-top',gap-inset);
    notes.dataset.inkInset = inset.toFixed(4);
    footer.dataset.textGap = String(gap);
  }
  function stripeBounds(list) {
    const rows = [...list.children];
    const stripe = row => {
      const fill = row.querySelector('.author-discipline-fill');
      const style = getComputedStyle(fill);
      const top = row.getBoundingClientRect().top + parseFloat(style.marginTop);
      return {top,bottom:top+parseFloat(style.height)};
    };
    return {top:stripe(rows[0]).top,bottom:stripe(rows.at(-1)).bottom};
  }
  function syncPhoneReading(scope) {
    const synthesis = scope.querySelector('.author-synthesis');
    const notes = scope.querySelector('.section-notes');
    if (!synthesis || !notes) return;
    const opening = scope.querySelector('[data-family-bind$=":lower0"]');
    if (matchMedia('(max-width:680px), (min-width:681px) and (max-width:1024px) and (orientation:portrait)').matches) {
      if (opening.parentElement === notes) {
        balanceNotes(notes);
        synthesis.before(opening);
        opening.classList.add('phone-opening');
      }
    } else if (opening.parentElement !== notes) {
      notes.prepend(opening);
      opening.classList.remove('phone-opening');
      delete notes.dataset.balanceSignature;
    }
  }
  function alignSectionLayout(scope) {
    if (!scope?.offsetWidth) return;
    syncPhoneReading(scope);
    const gap = parseFloat(getComputedStyle(scope).getPropertyValue('--section-block-gap')) || 25;
    const header = scope.querySelector('.description-heading');
    const heading = scope.querySelector('.section-heading > span:last-child');
    const synthesis = scope.querySelector('.author-synthesis');
    if (synthesis) {
      if (!matchMedia('(max-width:680px), (min-width:681px) and (max-width:1024px) and (orientation:portrait)').matches) balanceNotes(scope.querySelector('.section-notes'));
      const list = synthesis.querySelector('.author-disciplines');
      const lead = synthesis.querySelector('.panel-description-lead');
      const video = synthesis.querySelector('.section-video-preview');
      const compact = matchMedia('(max-width:680px), (min-width:681px) and (max-width:1024px) and (orientation:portrait)').matches;
      let stripes = stripeBounds(list);
      const field=synthesis.querySelector('.author-word-field');
      const fillStyle=getComputedStyle(list.querySelector('.author-discipline-fill'));
      const stripeHeight=parseFloat(fillStyle.height);
      const halo=Math.max(0,parseFloat(getComputedStyle(list).lineHeight)-stripeHeight)*2/3;
      const span=stripes.bottom-stripes.top-stripeHeight;
      const diameter=span-2*halo;
      setPixels(scope,'--section-video-size',diameter);
      setPixels(scope,'--section-video-top',stripes.top+stripeHeight/2+halo-field.getBoundingClientRect().top);
      setPixels(scope,'--section-video-halo',halo);
      setPixels(scope,'--section-video-right',halo+stripeHeight/2);
      if (compact) {
        // The phone reads: opening copy, stripes, graphite phrase, closing copy.
        const opening = scope.querySelector('.phone-opening');
        const notes = scope.querySelector('.section-notes');
        const openingInk = notesInk(opening);
        setPixels(opening,'margin-top',-parseFloat(opening.querySelector('p').dataset.inkTopInset || 0));
        setPixels(synthesis,'margin-top',0);
        setPixels(synthesis,'margin-top',gap-(stripeBounds(list).top-notesInk(opening).bottom));
        setPixels(lead,'margin-top',gap-(list.getBoundingClientRect().bottom-stripes.bottom));
        setPixels(notes,'margin-top',0);
        const closingInk = notesInk(notes);
        setPixels(notes,'margin-top',gap-(closingInk.top-lead.getBoundingClientRect().bottom));
        scope.dataset.blockGap = String(gap);
        video.dataset.stripeDiameter = diameter.toFixed(4);
        alignFooterGap(scope);
        return;
      }
      synthesis.style.removeProperty('margin-top');
      setPixels(lead,'margin-top',0);
      let phrase = textInk(lead);
      if (compact) {
        setPixels(lead,'margin-top',gap-(list.getBoundingClientRect().bottom-stripes.bottom)-(phrase.top-lead.getBoundingClientRect().top));
      } else {
        setPixels(lead,'margin-top',stripes.top-list.getBoundingClientRect().top-(phrase.top-lead.getBoundingClientRect().top));
      }
      const title = textInk(heading);
      const oldPadding = parseFloat(getComputedStyle(header).paddingBottom);
      if (!document.documentElement.classList.contains('menu-section-headings')) setPixels(header,'padding-bottom',oldPadding+gap-(stripeBounds(list).top-title.bottom));
      stripes = stripeBounds(list); phrase = textInk(lead);
      const rowBottom = Math.max(stripes.bottom,phrase.bottom,video.getBoundingClientRect().bottom);
      const notes = scope.querySelector('.section-notes');
      const blocks=[...notes.querySelectorAll('.section-note')];
      blocks.forEach(block=>block.style.removeProperty('margin-top'));
      if(compact){
        const previous=notesInk(blocks[0]),next=notesInk(blocks[1]);
        setPixels(blocks[1],'margin-top',gap-(next.top-previous.bottom));
      }
      const text = notesInk(notes);
      const inset = text.top-notes.getBoundingClientRect().top;
      setPixels(notes,'margin-top',gap-(synthesis.getBoundingClientRect().bottom-rowBottom)-inset);
      scope.dataset.blockGap = String(gap);
      video.dataset.stripeDiameter = diameter.toFixed(4);
      alignFooterGap(scope);
    } else if (scope.id === 'contacts') {
      const groups = [...scope.querySelectorAll('.contact-group')];
      const groupInk = group => {
        const boxes = [...group.querySelectorAll('h3,.contact-label,.contact-value')].map(textInk).filter(Boolean);
        return {top:Math.min(...boxes.map(box=>box.top)),bottom:Math.max(...boxes.map(box=>box.bottom))};
      };
      groups.slice(1).forEach((group,index) => {
          setPixels(group,'margin-top',0);
          const previous = groups[index];
          setPixels(group,'margin-top',gap-(previous.getBoundingClientRect().bottom-groupInk(previous).bottom)-(groupInk(group).top-group.getBoundingClientRect().top));
      });
      const title = textInk(heading);
      const first = groupInk(groups[0]);
      if (!document.documentElement.classList.contains('menu-section-headings')) setPixels(header,'padding-bottom',parseFloat(getComputedStyle(header).paddingBottom)+gap-(first.top-title.bottom));
    }
  }
  function alignAuthorComposition(scope) {
    const field=scope.querySelector('.author-word-field'),list=field?.querySelector('.author-disciplines');
    if(!list)return;
    const width=field.getBoundingClientRect().width;
    list.style.width='100%';scope.style.setProperty('--word-block-width',width.toFixed(4)+'px');
    list.style.setProperty('--author-axis-column',width+'px');list.style.removeProperty('font-size');list.style.removeProperty('line-height');
    const ink=metricCanvas;
    const words=[...document.querySelectorAll('.author-discipline-word')].map(word=>word.textContent);
    let style=getComputedStyle(list),size=parseFloat(style.fontSize);
    // Keep the circle clear of the longest word, including at the tablet boundary.
    for(let attempt=0;attempt<8;attempt++){
      style=getComputedStyle(list);size=parseFloat(style.fontSize);
      ink.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
      const tracking=parseFloat(style.letterSpacing)||0;
      const longest=Math.max(...words.map(word=>ink.measureText(word).width+tracking*word.length));
      const step=parseFloat(style.lineHeight),stroke=parseFloat(style.webkitTextStrokeWidth)||0;
      const bounds=ink.measureText('семиотика');
      const stripe=bounds.actualBoundingBoxAscent+bounds.actualBoundingBoxDescent+stroke;
      const halo=Math.max(0,step-stripe)*2/3;
      const diameter=(list.children.length-1)*step-2*halo;
      const required=longest+size*.36+diameter+2*halo+stripe+4;
      if(required<=width+.5)break;
      list.style.fontSize=(size*width/required).toFixed(4)+'px';
    }
    if (matchMedia('(max-width:680px), (min-width:681px) and (max-width:1024px) and (orientation:portrait)').matches) {
      const baseline = getComputedStyle(list);
      const step = baseline.lineHeight, size = parseFloat(baseline.fontSize);
      list.style.lineHeight = step;
      list.style.fontSize = (size * .9).toFixed(4) + 'px';
    }
    style=getComputedStyle(list);ink.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
    const stroke=parseFloat(style.webkitTextStrokeWidth)||0,reference=ink.measureText('семиотика');
    const ascent=reference.actualBoundingBoxAscent||parseFloat(style.fontSize)*.54;
    const height=ascent+(reference.actualBoundingBoxDescent||0)+stroke;
    list.querySelectorAll('.author-discipline-word').forEach(word=>{
      const marker=document.createElement('span');marker.setAttribute('aria-hidden','true');marker.style.cssText=baselineStyle;
      word.append(marker);const top=marker.getBoundingClientRect().top-word.getBoundingClientRect().top-ascent-stroke/2;marker.remove();
      word.parentElement.style.setProperty('--word-fill-height',height+'px');
      word.parentElement.style.setProperty('--word-fill-top',Math.max(0,top)+'px');
    });
  }
  const motionReflows=new WeakMap();
  function attachWordBlockMotion(scope) {
    const list = scope?.querySelector('.author-disciplines[data-hub-copy="disciplines"]');
    if (!list) return () => {};
    const rows = Array.from(list.children).map(row => {
      const word = row.querySelector('.author-discipline-word');
      const fill = row.querySelector('.author-discipline-fill');
      return word && fill ? {row, word, fill, text:word.textContent,
        fillStyles:['opacity','transform','--word-fold-crease'].map(name=>[name,fill.style.getPropertyValue(name),fill.style.getPropertyPriority(name)]),
        label:row.getAttribute('aria-label'), width:word.style.getPropertyValue('width'),
        widthPriority:word.style.getPropertyPriority('width')} : null;
    }).filter(Boolean);
    if (!rows.length) return () => {};
    let pieces = [], frame = null, resizeFrame = null, pointer = null, flowFrame=null, resizing=false;
    let start = performance.now(), lastFrame = start, entrance = true, destroyed = false;
    let building = false, measuredSignature = '';
    const clamp01 = value => Math.max(0, Math.min(1, value));
    const notify = () => window.dispatchEvent(new CustomEvent('hub:word-fold-frame', {
      detail:{number:scope.dataset.direction, state:list.dataset.wordFoldState}
    }));
    const signature = () => {
      const style = getComputedStyle(list), box = list.getBoundingClientRect();
      return [box.width.toFixed(3),style.fontFamily,style.fontSize,style.fontWeight,
        style.lineHeight,style.letterSpacing,style.webkitTextStrokeWidth].join('|');
    };
    function restoreNative() {
      rows.forEach(item => {
        item.word.textContent = item.text;
        item.fillStyles.forEach(([name,value,priority])=>{
          if(value)item.fill.style.setProperty(name,value,priority);
          else item.fill.style.removeProperty(name);
        });
        if (item.width) item.word.style.setProperty('width',item.width,item.widthPriority);
        else item.word.style.removeProperty('width');
        if (item.label === null) item.row.removeAttribute('aria-label');
        else item.row.setAttribute('aria-label',item.label);
      });
      list.classList.remove('word-fold-ready'); pieces = [];
    }
    function draw(time) {
      frame = null;
      if (destroyed || !list.isConnected) return;
      if (reducedMotion.matches) {build(false);return;}
      const step = Math.min(64, Math.max(0,time-lastFrame))/1000;
      lastFrame = time;
      const box = list.getBoundingClientRect();
      let moving = false, opening = false, folded = false;
      pieces.forEach(piece => {
        const t = entrance ? clamp01((time-start-piece.delay)/650) : 1;
        const progress = 1-Math.pow(1-t,4);
        if (t < 1) {moving=true;opening=true;}
        // A solid fill is one sheet; its nearest horizontal point keeps its
        // whole width responsive to the same 140px proximity as a title glyph.
        const x = box.left+piece.x;
        const hitX = pointer && piece.fill
          ? Math.max(x-piece.width/2,Math.min(x+piece.width/2,pointer.x)) : x;
        const distance = pointer ? Math.hypot(hitX-pointer.x,box.top+piece.y-pointer.y)/140 : 1;
        const aim = distance < 1 ? 1-distance*distance*(3-2*distance) : 0;
        const rate = aim > piece.hover ? 14 : 6;
        piece.hover += (aim-piece.hover)*(1-Math.exp(-rate*step));
        if (Math.abs(aim-piece.hover) > .001) moving=true;
        else piece.hover=aim;
        const tilt = piece.hover*45;
        if (tilt > .05) folded=true;
        piece.node.style.setProperty('transform',(piece.fill?'perspective(700px) ':'')+'rotateX('+(-((1-progress)*92+tilt))+'deg)');
        piece.node.style.setProperty('opacity',String(progress));
        piece.node.style.setProperty('--word-fold-crease',String(.55*clamp01(1-progress+tilt/90)));
      });
      list.dataset.wordFoldState = opening ? 'entering' : folded ? 'hover' : 'idle';
      notify();
      if (moving) frame=requestAnimationFrame(draw);
    }
    function schedule() {
      if (!destroyed && !reducedMotion.matches && frame === null) {
        lastFrame=performance.now();frame=requestAnimationFrame(draw);
      }
    }
    function build(play) {
      if (destroyed || !list.isConnected) return;
      building=true;resizing=false;
      if(flowFrame!==null){cancelAnimationFrame(flowFrame);flowFrame=null;}
      if (frame !== null) cancelAnimationFrame(frame);
      frame=null;restoreNative();
      // Native text is restored before the accepted sizing/height-fit pass.
      alignAuthorComposition(scope);
      alignSectionLayout(scope);
      if (reducedMotion.matches) {
        pointer=null;entrance=false;list.dataset.wordFoldState='still';
        list.dataset.wordFoldDuration='0';list.dataset.wordFoldPieceCount='0';
        measuredSignature=signature();building=false;notify();return;
      }
      rows.forEach((item,rowIndex) => {
        const textNode=item.word.firstChild, wordBox=item.word.getBoundingClientRect();
        if (!textNode || !item.text) return;
        const glyphs=typeof Intl.Segmenter === 'function'
          ? Array.from(new Intl.Segmenter('ru',{granularity:'grapheme'}).segment(item.text),part=>({text:part.segment,offset:part.index}))
          : Array.from(item.text).reduce((items,text)=>{items.push({text,offset:items.reduce((sum,part)=>sum+part.text.length,0)});return items;},[]);
        const ranges=glyphs.map(glyph=>{
          const range=document.createRange();range.setStart(textNode,glyph.offset);range.setEnd(textNode,glyph.offset+glyph.text.length);
          return range.getBoundingClientRect();
        });
        if (ranges.some((rect,index)=>index && rect.left < ranges[index-1].left)) return;
        const fragment=document.createDocumentFragment();
        glyphs.forEach((glyph,charIndex)=>{
          const segment=document.createElement('span'), piece=document.createElement('span');
          segment.className='word-fold-segment';segment.setAttribute('aria-hidden','true');
          segment.style.width=Math.max(0,(ranges[charIndex+1]?.left ?? ranges[charIndex].right)-ranges[charIndex].left)+'px';
          piece.className='word-fold-piece';piece.textContent=glyph.text;piece.dataset.foldText=glyph.text;
          segment.append(piece);fragment.append(segment);
          pieces.push({node:piece,segment,hover:0,x:0,y:0,width:0,fill:false,delay:rowIndex*45+charIndex*45});
        });
        item.row.setAttribute('aria-label',item.text);
        item.word.replaceChildren(fragment);
        // Keep the existing flex width and fill endpoint independent of glyph splitting.
        item.word.style.width=wordBox.width+'px';
        pieces.push({node:item.fill,segment:item.fill,hover:0,x:0,y:0,width:0,fill:true,delay:rowIndex*45+glyphs.length*45});
      });
      list.classList.add('word-fold-ready');
      alignSectionLayout(scope);
      const maximum=Math.max(0,...pieces.map(piece=>piece.delay));
      const staggerScale=maximum>850 ? 850/maximum : 1;
      const box=list.getBoundingClientRect();
      pieces.forEach(piece=>{
        piece.delay*=staggerScale;
        const rect=piece.segment.getBoundingClientRect();
        piece.x=rect.left-box.left+rect.width/2;piece.y=rect.top-box.top+rect.height/2;piece.width=rect.width;
        piece.node.style.setProperty('opacity',play?'0':'1');
        piece.node.style.setProperty('transform',(piece.fill?'perspective(700px) ':'')+(play?'rotateX(-92deg)':'rotateX(0deg)'));
      });
      entrance=play;start=performance.now();lastFrame=start;
      list.dataset.wordFoldState=play?'entering':'idle';
      list.dataset.wordFoldDuration=String(650+maximum*staggerScale);
      list.dataset.wordFoldPieceCount=String(pieces.length);
      measuredSignature=signature();building=false;notify();schedule();
    }
    function rebuild() {
      if (destroyed || building) return;
      clearTimeout(resizeFrame);resizeFrame=setTimeout(()=>{resizeFrame=null;build(false);},90);
    }
    const move=event=>{if(event.pointerType==='touch')return;pointer={x:event.clientX,y:event.clientY};schedule();};
    const leave=()=>{pointer=null;schedule();};
    const scroll=()=>{if(pointer)schedule();};
    const changed=()=>{
      if(destroyed||building||signature()===measuredSignature||flowFrame!==null)return;
      flowFrame=requestAnimationFrame(()=>{
        flowFrame=null;if(destroyed)return;
        // Native text fits continuously while the column moves; split glyphs only once afterwards.
        if(!resizing){resizing=true;if(frame!==null)cancelAnimationFrame(frame);frame=null;restoreNative();}
        building=true;alignAuthorComposition(scope);alignSectionLayout(scope);measuredSignature=signature();building=false;
        rebuild();
      });
    };
    list.addEventListener('pointermove',move,{passive:true});list.addEventListener('pointerleave',leave);
    window.addEventListener('resize',changed,{passive:true});window.addEventListener('scroll',scroll,{passive:true,capture:true});
    reducedMotion.addEventListener('change',rebuild);
    motionReflows.set(scope,rebuild);
    build(true);
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(changed):null;
    observer?.observe(list);
    const styleObserver=typeof MutationObserver==='function'?new MutationObserver(changed):null;
    styleObserver?.observe(scope,{attributes:true,attributeFilter:['style']});
    styleObserver?.observe(list,{attributes:true,attributeFilter:['style']});
    const usedFont=getComputedStyle(list);if(!document.fonts.check(usedFont.font||('700 '+usedFont.fontSize+' '+usedFont.fontFamily),'семиотика'))document.fonts.ready.then(()=>{if(!destroyed)rebuild();});
    return ()=>{
      motionReflows.delete(scope);destroyed=true;if(flowFrame!==null)cancelAnimationFrame(flowFrame);if(frame!==null)cancelAnimationFrame(frame);if(resizeFrame!==null)clearTimeout(resizeFrame);
      observer?.disconnect();styleObserver?.disconnect();
      list.removeEventListener('pointermove',move);list.removeEventListener('pointerleave',leave);
      window.removeEventListener('resize',changed);window.removeEventListener('scroll',scroll,{capture:true});
      reducedMotion.removeEventListener('change',rebuild);restoreNative();
      for(const key of ['wordFoldState','wordFoldDuration','wordFoldPieceCount'])delete list.dataset[key];
    };
  }

  window.HubSectionMotion = {attach: attachWordBlockMotion, alignFooter: alignFooterGap, alignLayout: alignSectionLayout,reflow:scope=>{const run=motionReflows.get(scope);if(run)run();else alignSectionLayout(scope);}};
})();

// Circular opening, playback controls and progress follow the Platform's comments player.
(() => {
  'use strict';
  const triggers = [...document.querySelectorAll('.section-video-preview')];
  const dialog = document.getElementById('section-video-player');
  const view = dialog.querySelector('.section-video-view');
  const video = dialog.querySelector('video');
  const poster = dialog.querySelector('.section-video-poster');
  const title = dialog.querySelector('.section-video-title');
  const status = dialog.querySelector('.section-video-status');
  const toggle = dialog.querySelector('.section-video-toggle');
  const ring = dialog.querySelector('.section-video-progress');
  const progress = dialog.querySelector('progress');
  let origin = null, animation = null, closing = false, generation = 0, frame = 0, closeTimer = 0;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resize = () => {
    const field = document.querySelector('.page-shell').getBoundingClientRect().width;
    const desired = matchMedia('(max-width:680px), (min-width:681px) and (max-width:1024px) and (orientation:portrait)').matches ? field : field * 2 / 3;
    dialog.style.setProperty('--section-player-size', Math.max(100,Math.min(desired,innerWidth-32,innerHeight-100))+'px');
  };
  const transform = () => {
    if (!origin?.isConnected) return null;
    const a = origin.getBoundingClientRect(), b = view.getBoundingClientRect();
    return `translate(${a.x+a.width/2-b.x-b.width/2}px,${a.y+a.height/2-b.y-b.height/2}px) scale(${a.width/b.width})`;
  };
  const draw = () => {
    const value = Number.isFinite(video.duration) && video.duration > 0 ? Math.min(1,video.currentTime/video.duration) : 0;
    ring.style.strokeDashoffset = String(307.876080052*(1-value));
    progress.value = value;
  };
  const update = () => {
    toggle.setAttribute('aria-label',video.paused?'Воспроизвести видео':'Пауза');
    view.classList.toggle('is-playing',!video.paused);
    draw();
  };
  const tick = () => {
    draw();
    if (!video.paused && !video.ended) frame = requestAnimationFrame(tick);
  };
  const resume = () => {
    if (dialog.dataset.ready !== 'true') return;
    const request = generation;
    status.textContent = '';
    if (video.error) video.load();
    video.play().catch(() => {
      if (request === generation && dialog.open) {
        status.textContent = 'Нажмите на видео, чтобы воспроизвести.';
        update();
      }
    });
  };
  const reset = () => {
    clearTimeout(closeTimer); closeTimer=0;
    generation++; animation?.cancel(); animation = null; closing = false;
    cancelAnimationFrame(frame); frame = 0;
    video.pause(); video.removeAttribute('src'); video.load();
    origin?.setAttribute('aria-expanded','false');
    if (origin?.isConnected) origin.focus({preventScroll:true});
    view.classList.remove('is-playing');
    status.textContent = ''; draw();
  };
  const close = () => {
    if (!dialog.open || closing) return;
    closing = true; video.pause(); animation?.cancel();
    const end = transform();
    if (reduced() || !end) {dialog.close();return;}
    animation = view.animate([{transform:'none'},{transform:end}],{duration:220,easing:'cubic-bezier(.3,0,.7,1)',fill:'forwards'});
    closeTimer = setTimeout(() => {if (closing && dialog.open) dialog.close();},300);
    animation.finished.then(() => dialog.close()).catch(() => {
      if (closing && dialog.open) dialog.close();
    });
  };
  triggers.forEach(button => {
    button.setAttribute('aria-label',(button.dataset.videoSrc.trim()?'Открыть видео: ':'Открыть фото: ')+button.dataset.videoTitle);
    button.addEventListener('click', () => {
    const src = button.dataset.videoSrc.trim();
    generation++; origin = button; closing = false;
    const image = button.querySelector('img');
    const ready = Boolean(src);
    dialog.dataset.ready = String(ready);
    resize(); title.textContent = button.dataset.videoTitle;
    poster.src = image.currentSrc || image.src; poster.alt = image.alt;
    const photoGeneration=generation,fullPhoto=image.src;
    if(!ready&&poster.src!==fullPhoto){
      const full=new Image();full.decoding='async';full.src=fullPhoto;
      full.decode().then(()=>{if(dialog.open&&!closing&&generation===photoGeneration)poster.src=fullPhoto;}).catch(()=>{});
    }
    poster.style.objectPosition = image.style.objectPosition;
    poster.hidden = ready; video.hidden = !ready; toggle.hidden = !ready;
    dialog.querySelector('.section-video-ring').hidden = !ready;
    progress.hidden = !ready;
    status.textContent = '';
    if (ready) {video.poster = image.src;video.src = src;video.setAttribute('aria-label',button.dataset.videoTitle);}
    draw(); button.setAttribute('aria-expanded','true');
    dialog.showModal();
    dialog.querySelector('.section-video-close').focus({preventScroll:true});
    const start = transform();
    if (!reduced() && start) animation = view.animate([{transform:start},{transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.75,.15,1)'});
    if (ready) {resume();update();}
    });
  });
  toggle.addEventListener('click', () => video.paused?resume():video.pause());
  for (const event of ['loadedmetadata','timeupdate','pause','ended']) video.addEventListener(event, () => {
    if (video.paused || video.ended) {cancelAnimationFrame(frame);frame=0;}
    update();
  });
  video.addEventListener('playing', () => {status.textContent='';update();cancelAnimationFrame(frame);tick();});
  video.addEventListener('error', () => {
    if (dialog.open && dialog.dataset.ready==='true') {status.textContent='Видео не загрузилось. Нажмите, чтобы повторить.';update();}
  });
  dialog.querySelector('.section-video-close').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('close',reset);
  dialog.addEventListener('click',event=>{
    if (event.target===dialog) {
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) close();
    }
  });
  window.addEventListener('resize',()=>{
    if (!dialog.open) return;
    animation?.cancel(); animation=null;
    if (closing) dialog.close();
    else resize();
  });
})();

(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width:680px), (min-width:681px) and (max-width:1024px) and (orientation:portrait)');
  const panels = [...document.querySelectorAll('.accordion-panel')];
  const links = panels.map(panel => panel.querySelector('.panel-activate'));
  links.forEach((link,index)=>link.setAttribute('aria-label',panels[index].querySelector('.panel-title-vertical').textContent));
  const tabs = [...document.querySelectorAll('.section-tab')];
  const descriptions = [...document.querySelectorAll('.description')];
  const home = document.querySelector('#home');
  let open = 0;
  let selected = null;
  let entranceAnimations = [];
  let disposeSectionMotion = () => {};
  let activeHeading = null;
  let activeSection = null;
  const brand = document.querySelector('.brand-pill');
  const menuHeading = document.createElement('span');
  menuHeading.className = 'brand-context';
  menuHeading.id = 'menu-section-title';
  menuHeading.setAttribute('role', 'heading');
  menuHeading.setAttribute('aria-level', '2');
  menuHeading.hidden = true;
  const menuCopy = document.createElement('span');
  const menuTail = document.createElement('span');
  menuTail.className = 'brand-context-tail';
  const menuLastWord = document.createElement('span');
  const menuMark = document.createElement('span');
  menuMark.className = 'brand-context-mark';
  menuMark.setAttribute('aria-hidden', 'true');
  menuTail.append(menuLastWord, menuMark);
  menuHeading.append(menuCopy, menuTail);
  brand.append(menuHeading);
  root.classList.add('menu-section-headings');

  function setMenuHeading(section) {
    let title = section.querySelector('.section-heading > span:last-child').textContent.trim();
    if (section.dataset.direction) {
      const panel = panels.find(item => item.dataset.familyCard === section.dataset.direction);
      title = section.dataset.direction + ' ' + panel.querySelector('.panel-caption strong').textContent.trim()
        + ' / ' + panel.querySelector('.panel-caption > span').textContent.trim();
    }
    const lastSpace = title.lastIndexOf(' ');
    menuCopy.textContent = title.slice(0, lastSpace + 1);
    menuLastWord.textContent = title.slice(lastSpace + 1);
    menuHeading.hidden = false;
    brand.classList.add('has-context');
    activeSection = section;
    activeHeading = menuHeading;
    section.setAttribute('aria-labelledby', menuHeading.id);
  }

  const headingInk = document.createElement('canvas').getContext('2d');

  function alignContactMarks(section) {
    const title=section.querySelector('.section-heading > span:last-child');
    const titleStyle=getComputedStyle(title),text=title.firstChild;
    headingInk.font=[titleStyle.fontStyle,titleStyle.fontWeight,titleStyle.fontSize,titleStyle.fontFamily].join(' ');
    const range=document.createRange();range.setStart(text,0);range.setEnd(text,1);
    const left=range.getBoundingClientRect().left-headingInk.measureText(text.data[0]).actualBoundingBoxLeft;
    const last=text.length-1;range.setStart(text,last);range.setEnd(text,last+1);
    const glyph=headingInk.measureText(text.data[last]),lastBox=range.getBoundingClientRect();
    const right=lastBox.left+glyph.actualBoundingBoxRight;
    const origin=section.getBoundingClientRect().left;
    section.style.setProperty('--contacts-left',(left-origin).toFixed(4)+'px');
    section.style.setProperty('--contacts-width',Math.min(section.clientWidth-(left-origin),Math.max(240,right-left)).toFixed(4)+'px');
    section.dataset.contactAxisLeft=(left-origin).toFixed(4);
    section.dataset.contactAxisRight=(right-origin).toFixed(4);
    section.querySelectorAll('.contact-link').forEach(link => {
      const value = link.querySelector('.contact-value');
      const style = getComputedStyle(value);
      headingInk.font = [style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
      const bounds = headingInk.measureText('Н');
      const ascent = bounds.actualBoundingBoxAscent || parseFloat(style.fontSize) * .75;
      const size = ascent + (bounds.actualBoundingBoxDescent || 0);
      const probe = document.createElement('span');
      probe.setAttribute('aria-hidden','true');
      probe.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
      value.prepend(probe);
      const top = probe.getBoundingClientRect().top - link.getBoundingClientRect().top - ascent;
      probe.remove();
      link.style.setProperty('--contact-mark-size',size.toFixed(4)+'px');
      link.style.setProperty('--contact-mark-top',top.toFixed(4)+'px');
    });
  }

  function alignHeadingMark(reflow=true) {
    if (phone.matches && activeSection) {
      if(activeSection.id==='contacts')return;
      if(reflow!==false)window.HubSectionMotion.alignLayout(activeSection);
      return;
    }
    if (!activeHeading || !activeSection || !activeHeading.offsetWidth) return;
    const availableHeight = brand.clientHeight - 8;
    let size = 11.264;
    activeHeading.style.fontSize = size + 'px';
    while (activeHeading.scrollHeight > availableHeight && size > 5) {
      size = Math.max(5, size - .2);
      activeHeading.style.fontSize = size + 'px';
    }
    const style = getComputedStyle(activeHeading);
    headingInk.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
    const bounds = headingInk.measureText('Н');
    const ascent = bounds.actualBoundingBoxAscent || size * .75;
    const descent = bounds.actualBoundingBoxDescent || 0;
    const cap = ascent + descent;
    activeHeading.style.setProperty('--context-mark-size', (cap * 1.1).toFixed(4) + 'px');
    activeHeading.style.setProperty('--context-mark-shift', (descent + cap * .05).toFixed(4) + 'px');
    if (activeSection.id === 'contacts') alignContactMarks(activeSection);
    if(reflow!==false)window.HubSectionMotion.alignLayout(activeSection);
  }

  let headingFrame=null;function queueHeadingMark(){if(headingFrame!==null)return;headingFrame=requestAnimationFrame(()=>{headingFrame=null;alignHeadingMark();});}
  const headingObserver = typeof ResizeObserver === 'function'
    ? new ResizeObserver(queueHeadingMark) : null;
  window.addEventListener('resize', queueHeadingMark, {passive: true});
  document.fonts.ready.then(alignHeadingMark);
  document.fonts.addEventListener('loadingdone', alignHeadingMark);

  function dockComposition() {
    if (!document.body.classList.contains('is-landing')) return;
    const shell = document.querySelector('.page-shell');
    const previousTop = shell.getBoundingClientRect().top;
    document.body.classList.remove('is-landing');
    window.scrollTo({top: 0, behavior: 'instant'});
    const offset = previousTop - shell.getBoundingClientRect().top;
    if (!reduced.matches && offset > 0) {
      const animation = shell.animate([
        {transform: `translateY(${offset}px)`},
        {transform: 'translateY(0)'}
      ], {duration: 620, easing: 'cubic-bezier(.2,.72,.13,1)'});
      reduced.addEventListener('change', () => animation.cancel(), {once: true});
    }
  }

  function expand(index) {
    open = index;
    panels.forEach((panel, i) => panel.classList.toggle('is-open', i === index));
  }
  function menu(page) {
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.page === page)));
  }
  function hideDescriptions() {
    headingObserver?.disconnect();
    if (activeSection) activeSection.setAttribute('aria-labelledby', activeSection.id + '-title');
    activeHeading = null;
    activeSection = null;
    menuHeading.hidden = true;
    brand.classList.remove('has-context');
    disposeSectionMotion();
    disposeSectionMotion = () => {};
    descriptions.forEach(section => { section.hidden = true; });
    links.forEach(link => link.setAttribute('aria-expanded', 'false'));
    selected = null;
  }
  function reveal(section, moveFocus = true) {
    section.hidden = false;
    setMenuHeading(section);
    alignHeadingMark(false);
    headingObserver?.observe(brand);
    if (!reduced.matches) section.animate([{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 380, easing: 'cubic-bezier(.16,1,.3,1)'});
    if (moveFocus) section.focus({preventScroll: true});
    if (section.querySelector('.author-disciplines')) {
      disposeSectionMotion = window.HubSectionMotion.attach(section);
    } else window.HubSectionMotion.alignLayout(section);
  }
  function showHome() {
    dockComposition();
    hideDescriptions();
    home.hidden = false;
    document.querySelectorAll('.utility-page').forEach(page => { page.hidden = true; });
    menu('home');
  }
  function showDirection(index) {
    showHome();
    expand(index);
    selected = index;
    if (phone.matches) {
      document.querySelector('.accordion-track').scrollTo({
        left: panels[index].offsetLeft - panels[0].offsetLeft,
        behavior: reduced.matches ? 'instant' : 'smooth'
      });
    }
    links[index].setAttribute('aria-expanded', 'true');
    const section = document.getElementById(links[index].getAttribute('aria-controls'));
    reveal(section);
  }
  function showUtility(page) {
    dockComposition();
    hideDescriptions();
    home.hidden = true;
    document.querySelectorAll('.utility-page').forEach(section => { section.hidden = section.id !== page; });
    menu(page);
    reveal(document.getElementById(page));
    window.scrollTo({top: 0, behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  function toggleDirection(index) {
    if (selected === index) hideDescriptions();
    else showDirection(index);
    dispatchEvent(new CustomEvent('hub-family:change'));
  }
  panels.forEach((panel, index) => {
    panel.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') expand(index); });
    links[index].addEventListener('focus', () => expand(index));
    links[index].addEventListener('click', event => {
      event.preventDefault();
      toggleDirection(index);
    });
    links[index].addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight') next = (open + 1) % panels.length;
      if (event.key === 'ArrowLeft') next = (open - 1 + panels.length) % panels.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = panels.length - 1;
      if (event.key === ' ') { event.preventDefault(); toggleDirection(index); return; }
      if (next === null) return;
      event.preventDefault();
      expand(next);
      links[next].focus({preventScroll: true});
      if (phone.matches) panels[next].scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block: 'nearest', inline: 'start'});
    });
  });
  tabs.forEach(tab => tab.addEventListener('click', () => {
    if (tab.dataset.page === 'home') {
      showHome();
      window.scrollTo({top: 0, behavior: reduced.matches ? 'instant' : 'smooth'});
    } else showUtility(tab.dataset.page);
  }));
  document.querySelector('.brand-pill').addEventListener('click', event => {
    event.preventDefault(); showHome(); window.scrollTo({top: 0, behavior: reduced.matches ? 'instant' : 'smooth'});
  });
  document.querySelectorAll('[data-show-contacts]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); showUtility('contacts');
  }));
  document.querySelectorAll('.close-description').forEach(button => button.addEventListener('click', () => {
    const index = selected;
    hideDescriptions();
    if (index !== null) links[index].focus({preventScroll: true});
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected !== null) {
      const index = selected; hideDescriptions(); links[index].focus({preventScroll: true});
    }
  });

  const titleObserver = new MutationObserver(() => {
    if (activeSection) { setMenuHeading(activeSection); alignHeadingMark(); }
  });
  panels.forEach(panel => titleObserver.observe(panel.querySelector('.panel-caption'), {childList: true, characterData: true, subtree: true}));

  async function entrance() {
    const finish = () => {
      entranceAnimations.forEach(animation => animation.cancel());
      entranceAnimations = [];
      root.classList.remove('enter-pending');
      document.querySelector('.brand-pill').classList.remove('brand-entrance');
      document.querySelector('.brand-shell')?.remove();
    };
    reduced.addEventListener('change', event => { if (event.matches) finish(); });
    if (reduced.matches) { finish(); return; }
    try {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (reduced.matches) { finish(); return; }
      const ease = 'cubic-bezier(.16,1,.3,1)';
      const animate = (el, frames, duration, delay = 0, easing = ease) => {
        const animation = el.animate(frames, {duration, delay, easing, fill: 'both'});
        entranceAnimations.push(animation);
      };
      if(phone.matches){
        const panel=panels.find(p=>p.classList.contains('is-open'));if(panel)animate(panel,[{opacity:0},{opacity:1}],320);
        root.classList.remove('enter-pending');
        await Promise.all(entranceAnimations.map(a=>a.finished.catch(()=>{})));return;
      }
      const brand = document.querySelector('.brand-pill');
      const shell = document.createElement('span');
      shell.className = 'brand-shell'; shell.setAttribute('aria-hidden', 'true');
      brand.prepend(shell); brand.classList.add('brand-entrance');
      animate(document.querySelector('.brand-disc'), [
        {transform: 'scale(.015)', opacity: 1, offset: 0, easing: 'cubic-bezier(.3,0,.35,1)'},
        {transform: 'scale(1.3)', opacity: 1, offset: .65, easing: 'ease-in-out'},
        {transform: 'scale(1)', opacity: 1, offset: 1}
      ], 800, 0, 'ease-in-out');
      const height = brand.offsetHeight;
      animate(shell, [
        {width: `${height}px`, opacity: 0, offset: 0},
        {width: `${height + (brand.clientWidth - height) * .08}px`, opacity: 1, offset: .12},
        {width: `${brand.getBoundingClientRect().width}px`, opacity: 1, offset: 1}
      ], 440, 456);
      animate(document.querySelector('.brand-name'), [{opacity: 0}, {opacity: 1}], 160, 956);
      tabs.forEach((tab, i) => animate(tab, [{opacity: 0, transform: 'perspective(650px) rotateX(-86deg)'}, {opacity: 1, transform: 'perspective(650px) rotateX(0deg)'}], 420, i * 90));
      panels.forEach((panel, i) => animate(panel, [{opacity: 0, transform: 'perspective(650px) rotateX(-86deg)'}, {opacity: 1, transform: 'perspective(650px) rotateX(0deg)'}], 420, 380 + i * 90));
      root.classList.remove('enter-pending');
      await Promise.all(entranceAnimations.map(animation => animation.finished.catch(() => {})));
    } finally { finish(); }
  }

  function familyPage(){return selected!==null?panels[selected].querySelector('.panel-activate').getAttribute('aria-controls').replace('section-','0.').replace('0.0','0.'):!home.hidden?'home':document.querySelector('.utility-page:not([hidden])')?.id==='contacts'?'0.9':'quotes';}
  function familyOpen(value){if(!value)return;const page=value==='d09'||value==='0.9'?'contacts':value;if((page==='contacts'&&familyPage()==='0.9')||page===familyPage())return;if(page==='home')showHome();else if(page==='contacts'||page==='quotes')showUtility(page);else{const number=page.startsWith('d')?'0.'+Number(page.slice(1)):page;const index=links.findIndex(link=>document.getElementById(link.getAttribute('aria-controls')).dataset.direction===number);if(index>=0)showDirection(index);}dispatchEvent(new CustomEvent('hub-family:change'));}
  window.HubFamily={open:familyOpen,page:familyPage};
  function familyLayout(){const mode=innerWidth<=680?'phone':innerWidth<=1024&&innerHeight>=innerWidth?'tablet-portrait':innerWidth<=1366?'tablet-landscape':'desktop';root.dataset.hubLayout=mode;dispatchEvent(new CustomEvent('hub:layout-change'));}
  window.GARDARI_HUB_LAYOUT={isCompact:()=>innerWidth<=1130,isSidebar:()=>false,setPreviewDevice:familyLayout};addEventListener('resize',familyLayout,{passive:true});familyLayout();

  entrance().catch(error => console.error('Hub experiment entrance:', error));
})();


;
(() => {
  'use strict';
  const phone=matchMedia('(max-width:680px), (min-width:681px) and (max-width:1024px) and (orientation:portrait)');
  const root=document.documentElement;
  const nativeFamilyOpen=window.HubFamily.open;
  window.HubFamily.open=value=>nativeFamilyOpen(phone.matches&&value==='home'?'0.1':value);
  const shell=document.querySelector('.page-shell');
  const photoLinks=[...document.querySelectorAll('.panel-activate')];
  const sourceLogo=document.querySelector('.brand-logo');
  const sourceOutline=document.querySelector('.section-tab .tab-outline');
  const rail=document.createElement('aside');rail.className='phone-side-nav';
  const toggle=document.createElement('button');toggle.className='phone-side-toggle';toggle.type='button';
  toggle.setAttribute('aria-label','Свернуть меню');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-controls','phone-side-links');
  const logo=document.createElement('span');logo.className='phone-side-logo';logo.append(sourceLogo.cloneNode(true));toggle.append(logo);
  const nav=document.createElement('nav');nav.id='phone-side-links';nav.className='phone-side-links';nav.setAttribute('aria-label','Разделы Хаба');
  const labels=[['Денис','Гардари'],['Концепт','бюро'],['Арт','галерея'],['Гардарики'],['Публикации'],['Платформа','инструментов'],['Клуб','Гардари'],['HOMO','COGITANS'],['Контакты'],['Цитаты']];
  const pages=['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','quotes'];
  const buttons=pages.map((page,i)=>{
    const button=document.createElement('button');button.type='button';button.className='section-tab phone-side-tab';button.dataset.sidePage=page;button.dataset.page=page;
    button.setAttribute('aria-label',(i+1)+'. '+labels[i].join(' '));button.setAttribute('aria-pressed','false');
    button.append(sourceOutline.cloneNode(true));
    const badge=document.createElement('span');badge.className='tab-number';badge.setAttribute('aria-hidden','true');const numberCopy=document.createElement('span');numberCopy.className='phone-side-number-copy';numberCopy.textContent=String(i+1);badge.append(numberCopy);
    const label=document.createElement('span');label.className='tab-name';label.setAttribute('aria-hidden','true');labels[i].forEach(line=>{const span=document.createElement('span');span.textContent=line;label.append(span);});
    button.append(badge,label);button.addEventListener('click',()=>{window.HubFamily.open(page);window.scrollTo({top:0,behavior:'instant'});syncSelection();});nav.append(button);return button;
  });
  rail.append(toggle,nav);document.body.append(rail);root.classList.add('phone-sidebar-preview');
  const numberCanvas=document.createElement('canvas').getContext('2d');
  function scaleSideFaces(){
    if(!phone.matches)return;
    buttons.forEach(button=>{
      if(!button.offsetWidth)return;
      const svg=button.querySelector('.tab-outline'),path=svg.querySelector('path'),box=path.getBBox();
      const scale=1+svg.viewBox.baseVal.width/(button.getBoundingClientRect().width*box.width);
      const x=box.x+box.width/2,y=box.y+box.height/2;
      path.setAttribute('transform','translate('+x+' '+y+') scale('+scale.toFixed(8)+') translate('+(-x)+' '+(-y)+')');
    });
  }


  function alignNumbers(){
    if(!phone.matches)return;
    buttons.forEach(button=>{
      const badge=button.querySelector('.tab-number'),copy=badge.querySelector('.phone-side-number-copy');
      if(!badge.offsetWidth)return;
      copy.style.transform='none';
      const style=getComputedStyle(copy);
      numberCanvas.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
      const ink=numberCanvas.measureText(copy.textContent);
      const marker=document.createElement('span');marker.setAttribute('aria-hidden','true');
      marker.style.cssText='display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
      copy.append(marker);
      const baseline=marker.getBoundingClientRect().top;
      const range=document.createRange();range.selectNodeContents(copy.firstChild);
      const origin=range.getBoundingClientRect().left;
      marker.remove();
      const box=badge.getBoundingClientRect();
      const dx=box.left+box.width/2-(origin-ink.actualBoundingBoxLeft+origin+ink.actualBoundingBoxRight)/2;
      const dy=box.top+box.height/2-(baseline-ink.actualBoundingBoxAscent+baseline+ink.actualBoundingBoxDescent)/2;
      copy.style.transform='translate('+dx.toFixed(4)+'px,'+dy.toFixed(4)+'px)';
    });
  }
  document.fonts.ready.then(alignNumbers);
  document.fonts.addEventListener('loadingdone',alignNumbers);

  const contacts=document.getElementById('contacts');
  contacts.querySelectorAll('.contact-link').forEach(row=>{
    const fill=document.createElement('span');fill.className='phone-contact-fill';fill.setAttribute('aria-hidden','true');row.append(fill);
  });
  function alignContacts(){
    if(!phone.matches||contacts.hidden)return;
    const labels=[...contacts.querySelectorAll('.contact-label')];
    const width=Math.max(...labels.map(label=>{
      const style=getComputedStyle(label);numberCanvas.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
      const text=label.textContent.trim().toLocaleUpperCase('ru')+':';
      return numberCanvas.measureText(text).width+(parseFloat(style.letterSpacing)||0)*text.length;
    }));
    contacts.style.setProperty('--phone-contact-label-width',width.toFixed(4)+'px');
    contacts.querySelectorAll('.contact-link').forEach(row=>{
      const word=row.querySelector('.contact-value'),style=getComputedStyle(word);
      numberCanvas.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
      const xHeight=numberCanvas.measureText('х').actualBoundingBoxAscent;
      const marker=document.createElement('span');marker.setAttribute('aria-hidden','true');
      marker.style.cssText='display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';word.append(marker);
      const top=marker.getBoundingClientRect().top-row.getBoundingClientRect().top-xHeight;marker.remove();
      row.style.setProperty('--phone-contact-rule-top',top.toFixed(4)+'px');
      row.style.setProperty('--phone-contact-rule-height',(xHeight+3+1).toFixed(4)+'px');
    });
  }
  document.fonts.ready.then(alignContacts);
  document.fonts.addEventListener('loadingdone',alignContacts);
  addEventListener('resize',alignContacts,{passive:true});
  let scrollFrame=null;
  function alignScrollEnd(){
    scrollFrame=null;
    const section=document.querySelector('.direction-description:not([hidden])');
    const footer=section?.querySelector('.panel-route-row,.panel-contact-row');
    if(!phone.matches||!footer?.offsetWidth){root.style.removeProperty('--phone-scroll-tail');return;}
    const last=buttons.at(-1).getBoundingClientRect(),pane=nav.getBoundingClientRect();
    const anchor=Math.min(last.bottom,pane.bottom);
    const tail=Math.max(0,innerHeight-anchor).toFixed(4)+'px';
    if(root.style.getPropertyValue('--phone-scroll-tail')!==tail)root.style.setProperty('--phone-scroll-tail',tail);
  }
  function queueScrollEnd(){if(scrollFrame===null)scrollFrame=requestAnimationFrame(alignScrollEnd);}
  const endObserver=typeof ResizeObserver==='function'?new ResizeObserver(queueScrollEnd):null;
  endObserver?.observe(shell);endObserver?.observe(nav);
  document.querySelectorAll('.panel-route-row,.panel-contact-row').forEach(row=>endObserver?.observe(row));
  addEventListener('resize',queueScrollEnd,{passive:true});nav.addEventListener('scroll',queueScrollEnd,{passive:true});
  document.fonts.ready.then(queueScrollEnd);
  let collapsed=false;
  function syncSelection(){const page=window.HubFamily.page();buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(pages[i]===page)));}
  function refreshLayout(){const section=document.querySelector('.direction-description:not([hidden])');if(section)window.HubSectionMotion.reflow(section);alignContacts();queueScrollEnd();}
  toggle.addEventListener('click',()=>{
    collapsed=!collapsed;root.classList.toggle('is-rail-collapsed',collapsed);nav.inert=collapsed;nav.setAttribute('aria-hidden',String(collapsed));
    toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',collapsed?'Развернуть меню':'Свернуть меню');
    requestAnimationFrame(refreshLayout);
  });
  shell.addEventListener('transitionend',event=>{if(event.target===shell&&event.propertyName==='margin-left')refreshLayout();});
  let sideSignature="";
  function syncMode(){
    photoLinks.forEach(link=>{if(phone.matches)link.setAttribute('tabindex','-1');else link.removeAttribute('tabindex');});
    if(phone.matches&&window.HubFamily.page()==='home')window.HubFamily.open('0.1');
    syncSelection();const next=innerWidth+"|"+phone.matches+"|"+getComputedStyle(toggle).width;
    if(next!==sideSignature){sideSignature=next;scaleSideFaces();alignNumbers();}
    queueScrollEnd();
  }
  addEventListener('hub-family:change',()=>{syncSelection();alignContacts();queueScrollEnd();});phone.addEventListener('change',syncMode);addEventListener('resize',()=>requestAnimationFrame(syncMode),{passive:true});syncMode();
})();

;(() => {
 const portrait=matchMedia('(min-width:681px) and (max-width:1024px) and (orientation:portrait)');
 function revealContacts(){
  if(!portrait.matches||window.HubFamily.page()!=='0.9')return;
  requestAnimationFrame(()=>{
   if(!portrait.matches||window.HubFamily.page()!=='0.9')return;
   window.dispatchEvent(new Event('resize'));
   window.scrollTo({top:0,behavior:'instant'});
  });
 }
 addEventListener('hub-family:change',revealContacts);
 portrait.addEventListener('change',revealContacts);
})();

;
(() => {
  const menu = document.getElementById('quote-share-popover');
  if (!menu) return;
  const download = menu.querySelector('.quote-share-download');
  const telegram = menu.querySelector('.quote-share-telegram');
  const phone = matchMedia('(max-width:680px)');
  const railToggle = document.querySelector('.phone-side-toggle');
  const appleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let automaticRail = false, changingRail = false;
  railToggle?.addEventListener('click', () => { if (!changingRail) automaticRail = false; });
  function syncPhoneWidth() {
    if (!railToggle) return;
    const quotes = window.HubFamily?.page() === 'quotes';
    const collapsed = document.documentElement.classList.contains('is-rail-collapsed');
    if (phone.matches && quotes && !collapsed) {
      changingRail = true; railToggle.click(); changingRail = false;
      automaticRail = true;
    } else if (automaticRail && (!phone.matches || !quotes)) {
      if (collapsed) { changingRail = true; railToggle.click(); changingRail = false; }
      automaticRail = false;
    }
  }
  phone.addEventListener('change', syncPhoneWidth);
  addEventListener('hub-family:change', syncPhoneWidth);
  syncPhoneWidth();

  // The old link-only Telegram endpoint cannot attach an image.
  telegram.removeAttribute('target');
  telegram.removeAttribute('rel');
  let selected, sequence = 0, objectURL, prepared, preparing = false, sharing = false;
  const isOpen = () => menu.classList.contains('is-open');
  const canCopyImage = () => typeof ClipboardItem === 'function' && typeof navigator.clipboard?.write === 'function';
  const label = (control, text, title = text) => {
    control.textContent = text;
    control.title = title;
    control.setAttribute('aria-label', title);
  };

  function close(returnFocus = false) {
    if (!isOpen()) return;
    menu.classList.remove('is-open');
    selected?.card.classList.remove('is-sharing');
    selected?.trigger.setAttribute('aria-expanded', 'false');
    sequence += 1;
    prepared = undefined;
    preparing = false;
    if (returnFocus) selected?.trigger.focus({preventScroll: true});
  }

  function place(card) {
    const box = card.getBoundingClientRect();
    menu.style.width = `${Math.min(244, box.width - 32)}px`;
    const width = menu.offsetWidth, height = menu.offsetHeight;
    const x = box.left + (box.width - width) / 2;
    const y = (Math.max(8, box.top) + Math.min(innerHeight - 8, box.bottom) - height) / 2;
    menu.style.left = `${Math.max(8, Math.min(x, innerWidth - width - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, innerHeight - height - 8))}px`;
  }

  function actions() {
    const {file, nativeShare} = prepared;
    download.href = objectURL;
    download.download = file.name;
    label(download, appleMobile ? (nativeShare ? 'Сохранить в Фото' : 'Скачать в Файлы') : 'Скачать',
      appleMobile ? (nativeShare ? 'В меню выберите «Сохранить изображение»' : 'Скачать PNG в «Файлы → Загрузки»') : 'Скачать карточку');
    if (nativeShare) {
      telegram.removeAttribute('href');
      telegram.removeAttribute('download');
      menu.dataset.delivery = 'file-share';
      label(telegram, 'В Telegram', 'В меню отправки выберите Telegram');
    } else if (canCopyImage()) {
      telegram.removeAttribute('href');
      telegram.removeAttribute('download');
      menu.dataset.delivery = 'clipboard';
      label(telegram, 'Скопировать картинку', 'Скопировать картинку, затем вставить её в Telegram');
    } else {
      pngForTelegram();
    }
    for (const control of [download, telegram]) {
      control.removeAttribute('aria-disabled');
      control.tabIndex = 0;
    }
    menu.dataset.fileReady = 'true';
    place(prepared.card);
  }

  function pngForTelegram() {
    telegram.href = objectURL;
    telegram.download = prepared.file.name;
    menu.dataset.delivery = 'png-download';
    label(telegram, 'PNG для Telegram', 'Скачайте PNG и прикрепите картинку в Telegram');
  }

  async function prepare(card, token, keyboard) {
    prepared = undefined;
    preparing = true;
    menu.dataset.fileReady = 'false';
    for (const control of [download, telegram]) {
      control.removeAttribute('href');
      control.setAttribute('aria-disabled', 'true');
      control.tabIndex = -1;
    }
    label(download, 'Готовлю картинку…');
    label(telegram, 'В Telegram');
    try {
      const image = card.querySelector('img');
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      const radius = parseFloat(getComputedStyle(card).borderTopLeftRadius) * canvas.width / card.getBoundingClientRect().width;
      context.beginPath();
      context.roundRect(0, 0, canvas.width, canvas.height, radius);
      context.clip();
      context.drawImage(image, 0, 0);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (token !== sequence) return;
      if (!blob) throw new Error('PNG preparation failed');
      const file = new File([blob], `Гардари — ${card.dataset.shareTitle}.png`, {type: 'image/png'});
      let nativeShare = false;
      try { nativeShare = typeof navigator.share === 'function' && navigator.canShare?.({files: [file]}) === true; } catch {}
      if (objectURL) URL.revokeObjectURL(objectURL);
      objectURL = URL.createObjectURL(blob);
      prepared = {card, file, nativeShare};
      preparing = false;
      actions();
      if (keyboard && document.activeElement === selected.trigger) download.focus({preventScroll: true});
    } catch {
      if (token !== sequence) return;
      preparing = false;
      label(download, 'Повторить подготовку');
      download.removeAttribute('aria-disabled');
      download.tabIndex = 0;
      label(telegram, 'Картинка недоступна');
    }
  }

  async function shareImage() {
    if (sharing) return;
    const current = prepared;
    sharing = true;
    try {
      // Call directly during this click: no decoding, canvas or await beforehand.
      // Files only: Telegram receives the PNG, without a webpage URL or text.
      await navigator.share({files: [current.file]});
      if (prepared === current) close();
    } catch (error) {
      if (error?.name !== 'AbortError' && prepared === current) {
        current.nativeShare = false;
        actions();
      }
    } finally { sharing = false; }
  }

  function ready(event) {
    if (prepared) return true;
    event.preventDefault();
    if (!preparing && selected) prepare(selected.card, ++sequence, false);
    return false;
  }

  document.querySelectorAll('.quote-share-trigger').forEach(trigger => {
    trigger.addEventListener('click', event => {
      const card = trigger.closest('.accepted-quote-card');
      if (isOpen() && selected?.card === card) { close(); return; }
      selected?.trigger.setAttribute('aria-expanded', 'false');
      selected?.card.classList.remove('is-sharing');
      selected = {card, trigger};
      card.classList.add('is-sharing');
      menu.dataset.card = card.dataset.acceptedQuote;
      menu.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      place(card);
      prepare(card, ++sequence, event.detail === 0);
    });
  });
  download.addEventListener('click', event => {
    if (!ready(event)) return;
    if (appleMobile && prepared.nativeShare) { event.preventDefault(); shareImage(); }
  });
  telegram.addEventListener('click', async event => {
    if (!ready(event)) return;
    if (prepared.nativeShare) { event.preventDefault(); shareImage(); return; }
    if (menu.dataset.delivery !== 'clipboard') return;
    event.preventDefault();
    const current = prepared;
    try {
      await navigator.clipboard.write([new ClipboardItem({'image/png': current.file})]);
      if (prepared === current) label(telegram, 'Картинка скопирована', 'Вставьте картинку в Telegram');
    } catch {
      if (prepared === current) pngForTelegram();
    }
  });
  menu.addEventListener('keydown', event => {
    if (['Enter', ' '].includes(event.key) && event.target.matches('a') && !event.target.hasAttribute('href')) {
      event.preventDefault();
      event.target.click();
    }
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    if (event.key === 'Tab') close(true);
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const links = [...menu.querySelectorAll('a')].filter(a => a.getAttribute('aria-disabled') !== 'true');
      const current = links.indexOf(document.activeElement);
      const delta = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1;
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : (current + delta + links.length) % links.length;
      links[index]?.focus();
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && isOpen()) close(true); });
  document.addEventListener('click', event => {
    if (isOpen() && !menu.contains(event.target) && !selected?.trigger.contains(event.target)) close();
  });
  addEventListener('hub-family:change', () => close());
  addEventListener('scroll', () => close(), {passive: true});
  addEventListener('resize', () => close(), {passive: true});
})();


/* Accepted Hub privacy choice, 2026-11-13. No counter configured. */
/* Privacy-choice preview.
 * No statistics are sent from this fork: data-metrica-id is empty.
 * When a counter is deliberately configured, it loads only after opt-in.
 */
(() => {
  'use strict';
  const VERSION = 2;
  const STORAGE_KEY = 'gardari-privacy-choice:v2';
  const SHARED_COOKIE = 'gardari_privacy_choice_v2';
  const LIFETIME = 180 * 24 * 60 * 60;
  const scriptElement = document.currentScript;
  const counterId = Number(scriptElement?.getAttribute('data-metrica-id') || 0);
  const panel = document.getElementById('gardari-consent-panel');
  const manageControls = [...document.querySelectorAll('[data-gardari-cookie-settings]')];
  const necessaryButton = document.getElementById('gardari-consent-necessary');
  const allowButton = document.getElementById('gardari-consent-allow');
  if (!panel || !manageControls.length || !necessaryButton || !allowButton) return;

  const host = location.hostname;
  const sharedDomain = host === 'gardari.art' || host.endsWith('.gardari.art');
  let choice = null;
  let analyticsStarted = false;
  let trigger = null;

  function readSharedCookie() {
    if (!sharedDomain) return null;
    const pair = document.cookie.split('; ').find(item => item.startsWith(SHARED_COOKIE + '='));
    if (!pair) return null;
    const value = pair.slice(SHARED_COOKIE.length + 1);
    if (value === 'yes') return true;
    if (value === 'no') return false;
    return null;
  }
  function readChoice() {
    const cookieChoice = readSharedCookie();
    if (cookieChoice !== null) return { analytics: cookieChoice };
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (parsed && parsed.version === VERSION && typeof parsed.analytics === 'boolean') {
        return { analytics: parsed.analytics };
      }
    } catch (_) {}
    return null;
  }
  function saveChoice(allow) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: VERSION,
        analytics: allow,
        updatedAt: new Date().toISOString()
      }));
    } catch (_) {}
    if (sharedDomain) {
      try {
        document.cookie = SHARED_COOKIE + '=' + (allow ? 'yes' : 'no') +
          '; Domain=.gardari.art; Path=/; Max-Age=' + LIFETIME + '; Secure; SameSite=Lax';
      } catch (_) {}
    }
  }
  function enableConfiguredMetrika() {
    if (analyticsStarted || !Number.isSafeInteger(counterId) || counterId <= 0) return;
    analyticsStarted = true;
    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = window.ym.l || Date.now();
    window.ym(counterId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://mc.yandex.ru/metrika/tag.js';
    tag.setAttribute('data-gardari-analytics', 'consent-gated');
    document.head.append(tag);
  }
  function showPanel(focus) {
    panel.hidden = false;
    manageControls.forEach(control => { control.hidden = true; });
    if (focus) necessaryButton.focus();
  }
  function hidePanel() {
    panel.hidden = true;
    manageControls.forEach(control => { control.hidden = false; });
    if (trigger?.isConnected) trigger.focus();
    trigger = null;
  }
  function setChoice(analytics) {
    const wasRunning = analyticsStarted;
    choice = { analytics };
    saveChoice(analytics);
    hidePanel();
    dispatchEvent(new CustomEvent('gardari:privacy-choice', { detail: { analytics } }));
    if (analytics) enableConfiguredMetrika();
    else if (wasRunning) {
      // A previously loaded analytics library cannot be unloaded in place.
      // Reload before further page interactions; the counter is not loaded again.
      location.reload();
    }
  }
  manageControls.forEach(control => control.addEventListener('click', () => {
    trigger = control;
    showPanel(true);
  }));
  necessaryButton.addEventListener('click', () => setChoice(false));
  allowButton.addEventListener('click', () => setChoice(true));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape' && choice) {
      event.preventDefault();
      hidePanel();
    }
  });
  window.GardariPrivacyChoice = Object.freeze({
    analyticsAllowed: () => choice?.analytics === true,
    openSettings: () => showPanel(true)
  });
  choice = readChoice();
  const previewRequested = new URLSearchParams(location.search).get('cookie-settings') === 'open';
  if (!choice) showPanel(false);
  else {
    hidePanel();
    if (choice.analytics) enableConfiguredMetrika();
    if (previewRequested) showPanel(false);
  }
})();


/* Consent geometry and legal disclosure. */
(() => {
  const field = document.querySelector('.page-shell');
  const contacts = document.querySelector('#contacts');
  const contactText = contacts.querySelector('.contacts-layout');
  const footer = document.querySelector('.gardari-consent-footer');
  const sync = () => {
    const box = field.getBoundingClientRect();
    document.documentElement.style.setProperty('--consent-field-left', box.left + 'px');
    document.documentElement.style.setProperty('--consent-field-width', box.width + 'px');
    const inset = contacts.hidden ? 0 : Math.max(0, contactText.getBoundingClientRect().left - box.left);
    footer.style.marginLeft = inset + 'px';
  };
  sync();
  new ResizeObserver(sync).observe(field);
  new ResizeObserver(sync).observe(contactText);
  new MutationObserver(sync).observe(contacts, { attributes: true, attributeFilter: ['style', 'hidden'] });
  addEventListener('resize', sync, { passive: true });
  const legal = document.querySelector('#gardari-legal-details');
  const legalLink = document.querySelector('[data-show-legal]');
  const closeLegal = () => {
    legal.hidden = true;
    legalLink.setAttribute('aria-expanded', 'false');
  };
  document.addEventListener('click', event => {
    if (event.target.closest('[data-page]')) closeLegal();
  }, true);
  legalLink.addEventListener('click', event => {
    event.preventDefault();
    const show = legal.hidden;
    legal.hidden = !show;
    legalLink.setAttribute('aria-expanded', String(show));
    if (show) requestAnimationFrame(() => legal.scrollIntoView({ behavior: 'instant', block: 'start' }));
  });
})();
