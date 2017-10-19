/**
 * Created by Administrator on 2017/4/17.
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
var typeStatus = getQueryString("typeStatus");
var specNumber = new Array();             //库存数量
var cartID = '';                            //购物车id
var nowNumber = new Array();                //结算时的购物车数量
var skuCheck = true;
//获取购物车信息
queryCartList();
function queryCartList() {
    $.ajax({
        type: "GET",
        url: "/rest/front/cart/selectCartList",
        data: {
            userID: 278
        },
        dataType: "json",
        success: function (data) {
            var cartList = data.data;
            var cartListHtml = "";
            if (data.data == "" || data.data == null) {
                cartListHtml = '<img src="" alt="" class="pic-lack" style="display: block"><div class="text-lack" style="display: block">亲，你购物车还没有宝贝哦～ </div>';
                $(".account-bar-tab").hide();//底部信息隐藏
            } else {
                var shopName = '';//声明全局店铺的名称
                $.each(cartList, function (i, o) {
                    var sellerName = o.sellerName;//获取店铺的名称同时塞值到sellerName
                    if (i == 0) {//判断是否为第一条数据，如果是第一条数据不加</div><div>
                        if (sellerName != "" && shopName != sellerName) {//判断店铺的名称不为空以及店铺名称不相等的情况下显示店铺信息
                            shopName = sellerName;
                            cartListHtml += '<div class="b-name"><label class="label-checkbox item-content" class="" data-name="' + o.sellerName + '"> <input type="checkbox" class="s-all" name="checkbox" /> <div class="item-media"> <i class="icon icon-form-checkbox"> </i>' +
                                '</div><i class="iconfont icon-shangdian"></i> <span>' + o.sellerName + '</span> <span class="icon icon-right cell-right" style="font-size: 12px;"></span> </label> </div><div class="underline"></div>' +
                                '';
                        }
                        cartListHtml += '<ul class="ul-list" ><li><i class="pid" style="display: none;" data-id="' + o.id + '"></i> <div class="item-content"><label class="yuBtn label-checkbox"><input type="checkbox" name="checkbox" data-value="'
                            + o.id + '"> <div class="item-media"><i class="icon icon-form-checkbox"></i></div> </label><img src="/'
                            + o.picture + '" class="img-div" data-id="' + o.productID + '"> <div class="item-inner div-item-inner cell-main" data-id="' + o.productID + '"> <div class="item-text">'
                            + o.productName + '</div> <div class="item-subtitle">规格：'
                            + o.specName + '</div> <div class="item-title-row"><div class="item-title">¥<span class="s-price">'
                            + o.price + '</span></div><div class="number">x'
                            + o.cartNum + '</div> <div class="item-after amount" > <a  href="javascript:void(0);" class="minus no-minus reduce" data="-"  data-id="' + o.id + '">-</a> <input type="number" value="'
                            + o.cartNum + '" id="itemAmount" class="text-amount s-num" data-stock="' + o.stock + '" disabled="disabled"> <a href="javascript:void(0);" class="plus" data="+" data-id="' + o.id + '">+</a> </div> </div> </div> </div> </li></ul>';
                    } else {
                        if (sellerName != "" && shopName != sellerName) {
                            shopName = sellerName;
                            cartListHtml += '</div><div><div class="b-name"><label class="label-checkbox item-content"> <input type="checkbox" class="s-all" name="checkbox" /> <div class="item-media"> <i class="icon icon-form-checkbox"> </i>' +
                                '</div><i class="iconfont icon-shangdian"></i> <span>' + o.sellerName + '</span> <span class="icon icon-right cell-right" style="font-size: 12px;"></span> </label> </div><div class="underline"></div>' +
                                '';
                        }
                        cartListHtml += '<ul class="ul-list" ><li><i class="pid" style="display: none;" data-id="' + o.id + '"></i> <div class="item-content"><label class="yuBtn label-checkbox"><input type="checkbox" name="checkbox" data-value="'
                            + o.id + '"> <div class="item-media"><i class="icon icon-form-checkbox"></i></div> </label><img src="/'
                            + o.picture + '" class="img-div" data-id="' + o.productID + '"> <div class="item-inner div-item-inner cell-main" data-id="' + o.productID + '"> <div class="item-text">'
                            + o.productName + '</div> <div class="item-subtitle">规格：'
                            + o.specName + '</div> <div class="item-title-row"><div class="item-title">¥<span class="s-price">'
                            + o.price + '</span></div><div class="number">x'
                            + o.cartNum + '</div> <div class="item-after amount" > <a  href="javascript:void(0);" class="minus no-minus reduce" data="-"  data-id="' + o.id + '">-</a> <input type="number" value="'
                            + o.cartNum + '" id="itemAmount" class="text-amount s-num" data-stock="' + o.stock + '" disabled="disabled"> <a href="javascript:void(0);" class="plus" data="+" data-id="' + o.id + '">+</a> </div> </div> </div> </div> </li></ul>';
                    }
                    specNumber[o.id] = parseInt(o.stock);           //获取当前库存
                    nowNumber[o.id] = o.cartNum;
                    //判断库存和购物车数量
                    if (specNumber[o.id] < nowNumber[o.id]) {
                        $.alert(o.productName + "库存不足");
                        skuCheck = false;
                    }
                });
            }
            cartListHtml = '<div  style="margin-bottom: 6px">' + cartListHtml + '</div>'
            $(".media-list").html(cartListHtml);
            cartProduct();
            //进入页面全选
            $('input').prop('checked', true).trigger('change');
            clickSpec();
        }
    });
}
//关于全选，单选，多选
function cartProduct() {
    //关于按照各个商店的选择判断
    $('.b-name').on('click', 'label', function (e) {
        e.preventDefault();
        var all = $(this).find('.s-all'),
            checkList = $(this).parent().parent().find('input').not('.s-all'),
            allCheckList = $(this).parents('.list-block').find('.s-all');
        if (all.prop('checked') == false) {
            checkList.prop('checked', false);

        } else {
            checkList.prop('checked', true);
            for (var i = 0; i < allCheckList.length; i++) {
                if ($(allCheckList[i]).prop('checked') == false) {
                    break;
                }
                if (i == allCheckList.length - 1 && $(allCheckList[i]).attr('checked') == true) {
                    $("#allCheckbox").find('input').prop('checked', true);
                }
            }
        }
        totalPrice();
    });
    //进入全选
    $("#allCheckbox").click(function (e) {
        e.preventDefault();
        var all = $('.s-all'),
            checkList = $(this).parents().find('input').not('.s-all');
        if (all.prop('checked') == false) {
            all.prop('checked', true);
            checkList.prop('checked', true);
        } else {
            all.prop('checked', false);
            checkList.prop('checked', false);
        }
        totalPrice();
    });
    //勾选的input的商品单价乘以数在相加
    $('input').change(function () {
        totalPrice();
    });
    //单个input选中时相对应的判断
    $('.item-media').click(function (e) {
        e.preventDefault();
        var multiselect = $(this).parent().parent().parent().parent().siblings().find('.s-all'),//声明每个家店自己input
            checkList = $(this).parent().find('input'),//声明每个的input
            all = $("#allCheckbox").find('input'),//声明全选的input
            allMultiselect = $(this).parents('.list-block').find('.s-all'),//声明每个的input里面自己归属的店铺的input
            allCheckList = $(this).parents('.ul-list').parent().find('.ul-list').find('input').not('.s-num');//声明选中店铺除了自己input外，其他子input
        $(this).siblings('input').trigger('change');
        if (checkList.prop('checked') == false) {
            checkList.prop('checked', true);
            for (var i = 0; i < allCheckList.length; i++) {
                if ($(allCheckList[i]).prop('checked') == false) {
                    break;
                }
                if (i == allCheckList.length - 1 && $(allCheckList[i]).prop('checked') == true) {
                    multiselect.prop('checked', true);
                }
            }
            for (var i = 0; i < allMultiselect.length; i++) {
                if ($(allMultiselect[i]).prop('checked') == false) {
                    break;
                }
                if (i == allMultiselect.length - 1 && $(allMultiselect[i]).prop('checked') == true) {
                    all.prop('checked', true);
                }
            }
        } else {
            checkList.prop('checked', false);
            multiselect.prop('checked', false);
            all.prop('checked', false);
        }
        totalPrice();
    })

}

//点击获取商品详情
function clickSpec() {
    //点击图片跳转
    $(".img-div").click(function () {
        var url = $(".list-block").attr("data-url");
        var id = $(this).attr("data-id");
        window.location.href = url + "?id=" + id;
    });
    //点击框
    $(".div-item-inner").click(function () {
        var url = $(".list-block").attr("data-url");
        var id = $(this).attr("data-id");
        window.location.href = url + "?id=" + id;
    });
}


//编辑商品数量
var obj = '';
function goodsNumFn() {
    var num = 1;
    //点击减号按钮
    $('.reduce').off('click').on('click', function () {
        cartID = $(this).attr("data-id");
        obj = $(this).siblings('input');
        num = obj.val();
        num--;
        if (specNumber[cartID] < num) {
            alert("库存不足");
            obj.val(specNumber[cartID]);
        } else {
            if (num < 1) {
                obj.val(1);
            } else {
                obj.val(num);
            }
        }
    });

    //点击加号按钮
    $('.plus').off('click').on('click', function () {
        cartID = $(this).attr("data-id");
        obj = $(this).siblings('input');
        num = obj.val();
        num++;
        if (specNumber[cartID] < num) {
            $.alert("库存不足");
            obj.val(specNumber[cartID]);
        } else {
            obj.val(num);
        }
    })
}

//点击编辑按钮显示
$("#editBtn").click(function () {
    //进入编辑窗口出现编辑
    goodsNumFn();
    if ($("#editBtn").text() == "编辑") {
        $("#editBtn").text("完成");
        $(".accountBtn").text("删除").addClass('g-del').removeClass('g-pay');
        $('.cart-content .item-after').css('display', 'inherit');
        $('.cart-content .number').hide();
        $("#editBtn").removeClass("savBtn");
        $(".img-div").unbind("click");
        $(".div-item-inner").unbind("click");
        return false;
    } else {
        $("#editBtn").text("编辑");
        $(".accountBtn").text("结算").addClass('g-pay').removeClass('g-del');
        $("#editBtn").addClass("savBtn");
        $('.cart-content .item-after').css('display', 'none');
        var number = $('.cart-content .number');
        for (var i = 0; i < number.length; i++) {
            $(number[i]).text('x' + $(number[i]).siblings('.item-after').find('.s-num').val())
        }
        number.show();
        totalPrice();
    }
});

//计算总价 所有勾选的商品单价乘以数 在相加
function totalPrice() {
    var selectInput = $('.content').find('input:checked').not('.s-all'),
        totalPrice = 0;
    if (selectInput.length == 0) {
        $('.total-price').text('0');
    } else {
        for (var i = 0; i < selectInput.length; i++) {
            var p = $(selectInput[i]).parent('.yuBtn').siblings('.item-inner').find('.s-price').text(),
                n = $(selectInput[i]).parent('.yuBtn').siblings('.item-inner').find('.s-num').val();
            totalPrice = totalPrice + (p * n);
        }
        $('.total-price').text(parseFloat(totalPrice.toFixed(2)));
    }
}
//购物车删除
$(document).on('click', '.g-del', function () {
    var cInput = $(document).find('input:checked').not(".s-all");
    if (cInput.length == 0) {
        $.toast('请选择要删除的商品');
        return false;
    } else {
        //选中状态下的 productID list 和 商品数量list
        var IDArr = new Array();
        for (var i = 0; i < cInput.length; i++) {
            var pid = $(cInput[i]).parents('li').find('.pid').attr('data-id');
            IDArr[i] = pid;
        }
        $.ajax({
            type: "POST",
            url: "/rest/front/cart/deleteCart",
            dataType: "json",
            data: {
                ids: IDArr
            },
            success: function (data) {
                if (data.success) {
                    queryCartList();
                    $.toast("删除成功");
                    setTimeout(function () {
                        totalPrice();
                    }, 100)
                }
            }
        })
    }
});
//购物车编辑
$(document).on('click', '.savBtn', function () {
    var cInput = $(document).find('input:checked').not(".s-all");
    if (cInput.length == 0) {
        $.toast('请选择要编辑的商品');
        return false;
    } else {
        //选中状态下的 productID list 和 商品数量list
        var cart = new Array;
        var pid = new Array();
        var number = new Array();
        for (var i = 0; i < cInput.length; i++) {
            pid[i] = $(cInput[i]).parents('li').find('.pid').attr('data-id');
            number[i] = $(cInput[i]).parents('li').find('#itemAmount').val();
            cart.push({'id': pid[i], 'cartNum': number[i]});
        }
        $.ajax({
            type: "POST",
            url: "/rest/front/cart/updateCart",
            async: false,
            dataType: "json",
            contentType: "application/json", // 指定这个协议很重要
            data: JSON.stringify(cart),
            success: function (data) {
                if (data.success) {
                    queryCartList();
                    $.toast("编辑成功");
                    setTimeout(function () {
                        totalPrice();
                    }, 100)
                }
            }
        });
    }
});
$(document).on('click', '.g-pay', function () {
    var cInput = $(document).find('input:checked').not(".s-all");
    //如果没有勾选商品 点击结算无反应
    if (cInput.length == 0) {
        $.toast('请选择要购买的商品');
        return false;
    } else {
        if (skuCheck == false) {
            $.alert("库存不足，无法结算！");
            return false;
        }
        var cartIDs = "";
        for (var i = 0; i < cInput.length; i++) {
            cartIDs = cartIDs + $(cInput[i]).attr("data-value") + ",";
        }
        cartIDs = cartIDs.substring(0, cartIDs.length - 1);
        var url = $(".accountBtn").attr("data-url");
        url = url + "?cartID=" + cartIDs;
        window.location.href = url;
    }
});
//结算--跳转到订单详情
$('#back').click(function () {
    //if (cart == "2") {
    //    window.location.href = "/rest/front/product/toCatalogDetail?id=" + id + "&type=" + type + "&cart=" + cart;
    //} else {
    //    window.location.href = "/rest/front/product/toProductDetail?id=" + id + "&typeStatus=" + typeStatus;
    //}
    window.history.go(-1);

});