export class ImageZoom {
    constructor() {
        this.$dom = null;
        this.$img = null;
        this.$zoom = null;
        this.domInfo = { width: null, height: null };
    }
    /* Builder */
    set_dom($dom) {
        this.$dom = $dom;
        return this;
    }//set_dom

    init() {
        if (!this.$dom) return console.error("no DOM");
        this.$img = this.$dom.querySelector("IMG");
        if (!this.$img) return console.error("이미지 없음");
        const imgUrl = this.$img.src;
        if (!imgUrl) return console.error("이미지 경로 없음");

        /* zoom dom */
        this.$zoom = this.make_zoom_element(imgUrl);
        this.$dom.appendChild(this.$zoom);

        /* set info */
        this.domInfo.width = this.$dom.offsetWidth;
        this.domInfo.height = this.$dom.offsetHeight;

        /* event */
        this.$dom.addEventListener("mousemove", this.on_mouse_move);
    }//init

    /**
     * 
     * @param {*} imgUrl 
     * @returns 
     */
    make_zoom_element(imgUrl) {
        const $zoom = document.createElement("DIV");
        $zoom.classList.add("zoom");
        $zoom.style.backgroundImage = `url(${imgUrl})`;
        return $zoom;
    }//make_zoom_element

    /**
     * 
     * @param {*} e 
     */
    on_mouse_move = (e) => {
        const { width, height } = this.domInfo;
        const { offsetX, offsetY } = e;
        const x = (offsetX / width) * 100;
        const y = (offsetY / height) * 100;
        this.$zoom.style.backgroundPosition = `${x}% ${y}%`;
    }//on_mouse_move 
}//ImageZoom