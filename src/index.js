import Siema from 'siema';
  class ShopGallery extends HTMLElement {
	attributeChangeCallback(attribute, oldVal, newVal) {
		switch(attribute) {
			case "shop-url":
				this.shopUrl = newVal; break;
		}
	}
	
	connectedCallback() {
		this.initData();
		this.constructGallery(this.shopUrl);
	}

	initData() {
		this.shopUrl = this.getAttribute('shop-url');
        const modalCloseElement = document.querySelector("modal-close");
	}

	async constructGallery(shopUrl) {
		const response = await fetch(shopUrl, {credential: "include"});
		const shopInfoData = await response.json();
		const ulElement = document.createElement("ul");
		shopInfoData.groups.forEach(group => {
			this.createProductGallery(group, ulElement);
		})
		this.appendChild(ulElement);
	}
    
    createProductGallery(shopData, ulElement) {
    	const listElement= document.createElement("li");
    	this.constructProductNameElement(listElement, shopData.name, shopData.links.www);
    	this.constructImageElement(listElement, shopData.hero);
    	this.constructPriceElement(listElement, shopData.priceRange);
        this.addModalListener(listElement, shopData);
    	ulElement.appendChild(listElement);
    }

    constructImageElement(listElement, imageSrc) {
    	const imageTag = document.createElement("img");
    	imageTag.src = imageSrc.href;
    	listElement.appendChild(imageTag);
    }

    constructProductNameElement(listElement, productName, productUrl) {
        const anchorElement = document.createElement("a");
        anchorElement.href = productUrl;
    	anchorElement.classList.add("product-name");
        this.addClickListener(anchorElement);
    	anchorElement.innerHTML = productName;
    	listElement.appendChild(anchorElement);
    }

    constructPriceElement(listElement, priceData) {
    	const priceElement = document.createElement("span");
    	priceElement.classList.add("product-price");
    	priceElement.innerHTML = `$${priceData.selling.low} - $${priceData.selling.high}`;
    	listElement.appendChild(priceElement);
    }

    addModalListener(listElement, shopData) {
        const siemaElement = document.querySelector(".siema");
        listElement.addEventListener('click', function(e) {

            shopData.images.forEach(imageData => {
                const imageElement = document.createElement("img");
                imageElement.src = imageData.href;
                siemaElement.appendChild(imageElement);
            });
            var siema = new Siema({
                    selector: '.siema',
                    easing: 'ease-out'
                });
            const gallaryModal = document.querySelector(".gallery-modal");
            gallaryModal.classList.remove("gallery-modal");
            gallaryModal.classList.add("show-modal");
            const modalCloseElement = document.querySelector(".modal-close");
            document.querySelector('.siema-prev').addEventListener('click', () => siema.prev());
            document.querySelector('.siema-next').addEventListener('click', () => siema.next());
            modalCloseElement.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const showGalleryModal = document.querySelector('.show-modal');
                showGalleryModal.classList.add("gallery-modal");
                showGalleryModal.classList.remove("show-modal");
                siema.destroy();
                while (siemaElement.hasChildNodes()) {
                    siemaElement.removeChild(siemaElement.lastChild);
                }
            })
        });
    }

    addClickListener(anchorElement) {
        anchorElement.addEventListener('click', function(e) {
            e.stopPropagation();
        })
    }


}
window.customElements.define('shop-gallery', ShopGallery)
