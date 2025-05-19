export default function scaleImages(images, maxWidth, maxHeight) {
		let heigths = [];
		images.forEach((image) => {
			const scale = maxWidth / image.width
			const targetHeight = scale * image.height;
			if (targetHeight > maxHeight) {
				const targetWidth = scale * image.width;
				if (targetWidth <= maxWidth) {
					heigths.push(maxHeight);
				}
			} else {
				heigths.push(targetHeight);
			}
		});
		return Math.max(...heigths);
	}