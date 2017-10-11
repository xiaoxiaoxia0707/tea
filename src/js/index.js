var mySwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                autoplay: 2000,
                loop: true,
                paginationClickable: true,
                onImagesReady: function (swiper) {
                    var obj = $('.swiper-slide').find('img');
                    var max;
                    var heightList = new Array;
                    for (var i = 0; i < obj.length; i++) {
                        heightList[i] = $(obj[i]).height()
                    }
                    max = Math.max.apply(null, heightList);
                    $('.swiper-slide').height(max);
                    $('.swiper-wrapper').height(max);
                }
            });