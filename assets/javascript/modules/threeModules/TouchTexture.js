import { easeOutQuad, easeInOutQuad, easeOutSine, easeInOutSine } from '../../utils/easing.utils';

class TouchTexture {
    constructor() {
        this._size = 64;
		this._maxAge = 120;
		this._radius = 0.15;
        this._trail = [];

        this.texture = null;
        
        this._setup();
    }

    update() {
        this._ctx.fillStyle = 'black';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        
        // age points
		this._trail.forEach((point, i) => {
			point.age++;
			// remove old
			if (point.age > this._maxAge) {
				this._trail.splice(i, 1);
			}
		});

		this._trail.forEach((point, i) => {
			this._drawTouch(point);
		});

		this.texture.needsUpdate = true;
    }

    _drawTouch(point) {
        const pos = {
			x: point.x * this._size,
			y: (1 - point.y) * this._size
		};

		let intensity = 1;
		if (point.age < this.maxAge * 0.3) {
			intensity = easeOutSine(point.age / (this._maxAge * 0.3), 0, 1, 1);
		} else {
			intensity = easeOutSine(1 - (point.age - this._maxAge * 0.3) / (this._maxAge * 0.7), 0, 1, 1);
		}

		intensity *= point.force;

		const radius = this._size * this._radius * intensity;
		const grd = this._ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
		grd.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
		grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

		this._ctx.beginPath();
		this._ctx.fillStyle = grd;
		this._ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
		this._ctx.fill();
    }

    addTouch(point) {
        let force = 0;
        const last = this._trail[this._trail.length - 1];
        
		if (last) {
			const dx = last.x - point.x;
			const dy = last.y - point.y;
			const dd = dx * dx + dy * dy;
			force = Math.min(dd * 10000, 1);
        }
        
		this._trail.push({ x: point.x, y: point.y, age: 0, force });
    }

    _setup() {
        this._canvas = new OffscreenCanvas(this._size, this._size);
        this._ctx = this._canvas.getContext('2d');
        this._ctx.fillStyle = 'black';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        
        this.texture = new THREE.Texture(this._canvas);
    }
}

export default TouchTexture;