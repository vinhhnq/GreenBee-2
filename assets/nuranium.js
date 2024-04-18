(function ($) {
  var body = $("body");

  var wishListsArr = localStorage.getItem("wishListsArr")
    ? JSON.parse(localStorage.getItem("wishListsArr"))
    : [];
  localStorage.setItem("wishListsArr", JSON.stringify(wishListsArr));
  if (wishListsArr.length) {
    wishListsArr = JSON.parse(localStorage.getItem("wishListsArr"));
  }

  $(document).ready(function () {
    $(document).ajaxStart(function () {
      nuranium.isAjaxLoading = true;
    });

    $(document).ajaxStop(function () {
      nuranium.isAjaxLoading = false;
    });
    nuranium.init();

    $("#popup-subscribe i.zmdi-close").on("click", function () {
      $(this).parents("#popup-subscribe").modal("hide");
    });

    var formData = {
      purchase_code: vinovathemes.main_info.lic,
      shopify_domain: vinovathemes.main_info.domain,
    };
    nuranium.validLicense(formData);
  });

  var nuranium = {
    validLicense: function (formData) {
      $.ajax({
        url: "https://vinovathemes.com/license/check_license.php",
        type: "post",
        data: formData,
        success: function (d) {
          var res = JSON.parse(d);
          $("#Nov_purchasecode").on("contextmenu", function (event) {
            event.preventDefault();
          });
          if (res.status == false) {
            $("#Nov_purchasecode").removeClass("hide hidden");
            $("#Nov_purchasecode-waring").html(res.msg);
            return false;
          }
          if (res.status) {
            $("#Nov_purchasecode-waring").html(res.msg).slideDown(250);
            //$('.modal-backdrop').remove();
            setTimeout(function () {
              $("#Nov_purchasecode").remove();
            }, 1000);
          }
        },
      });
    },
    isAjaxLoading: false,
    init: function () {
      this.closeModal();
      this.novProductTabs();

      this.initNovWishListIcons();
      this.doAddOrRemoveWishlistProduct();
      this.doAddOrRemoveWishlist();

      if ($("body").hasClass("template-page") && $(".wishlist-page").length) {
        this.initNovWishListsPage();
      }
      this.ajaxProductAddToCart();
      this.ajaxAddToCart();
      this.ajaxChangeFromCart();
      this.initMiniCart();

      this.ajaxRemoveFromCart();
      this.changeQuantityPageCart();
      this.initCollapseSidebarBlock();
      this.changeQuantityMiniCart();
      this.initproductItemColorSwatch();
      this.productItemSwatch();
      this.togglePopupAddToCart();
      if (body.hasClass("template-collection")) {
        this.initCollectionPageLoadmore();
      }
      if ($(window).width() > 767) {
        this.initQuickView();
      }
    },
    initCollectionPageLoadmore: function () {
      var scroll__infitiny = $(".scroll__infitiny");
      var infiniteScrolling_url = ".scroll__infitiny a";
      if (scroll__infitiny.length) {
        body
          .off("click.initCollectionPageLoadmore", infiniteScrolling_url)
          .on(
            "click.initCollectionPageLoadmore",
            infiniteScrolling_url,
            function (e) {
              e.preventDefault();
              e.stopPropagation();
              if (!$(this).hasClass("disabled")) {
                var url = $(this).data("href");
                nuranium.ajaxCollectionPageLoadmoreGetContent(url);
              }
            }
          );

        $(window).scroll(function () {
          if (nuranium.isAjaxLoading) return;
          var collectionContent = $(".collection-filter__content");
          var collectionTop = collectionContent.offset().top;
          var collectionHeight = collectionContent.outerHeight();
          var posTop = collectionTop + collectionHeight - $(window).height();
          if (
            $(this).scrollTop() > posTop &&
            $(this).scrollTop() < posTop + 200
          ) {
            var button = $(infiniteScrolling_url);
            if (button.length && !button.hasClass("disabled")) {
              var url = button.data("href");
              nuranium.ajaxCollectionPageLoadmoreGetContent(url);
            }
          }
        });
      }
    },
    ajaxCollectionPageLoadmoreGetContent: function (url) {
      if (nuranium.isAjaxLoading) return;
      $.ajax({
        type: "GET",
        url: url,
        beforeSend: function () {
          $(".scroll__infitiny").removeClass("loading").addClass("loading");
        },
        success: function (data) {
          nuranium.ajaxCollectionPageLoadmoreMapData(data);
          Currency.convertAll(
            shopCurrency,
            $("#currencies span.selected").attr("data-currency")
          );
        },
        complete: function () {
          $(".scroll__infitiny").removeClass("loading");
        },
      });
    },
    ajaxCollectionPageLoadmoreMapData: function (data) {
      var collectionTemplate = $(".collection-template");
      var currentProductCollection = collectionTemplate.find(
        ".product-collection"
      );
      var currentProductCount = collectionTemplate.find(".paging");
      var newCollectionTemplate = $(data).find(".collection-template");
      newProductCollection = newCollectionTemplate.find(".product-collection");
      newProductCount = newCollectionTemplate.find(".paging");
      newProductItem = newProductCollection.children(".product--item");
      currentProductCount.replaceWith(newProductCount);
      if (newProductCollection.length) {
        currentProductCollection.append(newProductItem);

        var n = collectionTemplate.find(".product--item").length;
        var m = $(".pagination__bar").data("max");
        $(".pagination__count .count").text(n);
        $(".pagination__bar .progress").css("width", (n / m) * 100 + "%");
      }
    },
    togglePopupAddToCart: function () {
      $(".selector-wrapper-1").each(function () {
        if ($(this).hasClass("opt-color.hide")) {
          $(this)
            .closest(".item-product__popup--variant")
            .find(".btn-close-quick-add")
            .hide();
        }
      });
      $(document).on("click", ".btn-quick-add", function () {
        $(".item-product__popup--variant").removeClass("act");
        $(".item-product .thumbnail-container").removeClass("popup-act");
        $(this).parent().find(".item-product__popup--variant").addClass("act");
        $(this).parents(".thumbnail-container").addClass("popup-act");
        if ($(this).parents(".nov-slick-carousel").data("nav") == true) {
          $(this)
            .parents(".nov-slick-carousel")
            .find(".slick-arrow")
            .css("visibility", "hidden");
        }
        if ($(this).parents(".collection-carousel").data("nav") == true) {
          $(this)
            .parents(".collection-carousel")
            .find(".slick-arrow")
            .css("visibility", "hidden");
        }
        $(this)
          .parents(".item-product")
          .find(".countdownfree")
          .css("visibility", "hidden");
      });
      $(document).on("click", ".btn-close-quick-add", function () {
        $(this).parent().removeClass("act");
        $(this).parents(".thumbnail-container").removeClass("popup-act");
        if ($(this).parents(".nov-slick-carousel").data("nav") == true) {
          $(this)
            .parents(".nov-slick-carousel")
            .find(".slick-arrow")
            .css("visibility", "visible");
        }
        if ($(this).parents(".collection-carousel").data("nav") == true) {
          $(this)
            .parents(".collection-carousel")
            .find(".slick-arrow")
            .css("visibility", "visible");
        }
        $(this)
          .parents(".item-product")
          .find(".countdownfree")
          .css("visibility", "visible");
      });
      /*$(document).on("click", function(event){
                  if(!$(event.target).closest(".inner-top").length){
                      $(".item-product__popup--variant").removeClass('act');
                  }
              });*/
    },
    initCollapseSidebarBlock: function () {
      $(document).on("click", ".facets__label--title", (t) => {
        var a = $(t.currentTarget),
          o = a.parents(".js-filter").find(".facets__content");
        a.parent().hasClass("act")
          ? (a.parent().removeClass("act"),
            a.parents(".js-filter").removeClass("act"),
            o.slideUp())
          : (a.parent().addClass("act"),
            a.parents(".js-filter").addClass("act"),
            o.slideDown());
      });
    },
    closeModal: function () {
      $(".close-modal, .overlay").click(function () {
        $(".loading-modal").css({
          opacity: "0",
          visibility: "hidden",
          transform: "translateX(410px)",
          transition: "all 0.3s",
        });
      });
    },

    novProductTabs: function () {
      var productTabs = $("[data-product-tabs]");
      productTabs.each(function () {
        var self = $(this),
          listTabs = self.find(".list-product-tabs"),
          tabLink = listTabs.find("[data-product-tabtop]"),
          tabContent = self.find("[data-product-TabContent]"),
          linkActive = self.find(".list-product-tabs .tab-links.active"),
          activeTab = self.find(".product-tabs-content .tab-content.active");

        nuranium.doAjaxNovProductTabs(
          linkActive.data("href"),
          activeTab.find(".products-grid"),
          tabLink
        );
        tabLink.off("click").on("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          if ($(this).hasClass("active")) {
            return;
          }
          if (!$(this).hasClass("active")) {
            var curTab = $(this),
              curTabContent = $(curTab.data("target"));
            tabLink.removeClass("active");
            tabContent.removeClass("active");
            if (
              !curTabContent
                .find(".collection-carousel")
                .hasClass("slick-initialized")
            ) {
              nuranium.doAjaxNovProductTabs(
                curTab.data("href"),
                curTabContent.find(".products-grid"),
                tabLink
              );
            }
            curTab.addClass("active");
            curTabContent.addClass("active");
            if (
              curTabContent
                .find(".collection-carousel")
                .hasClass("slick-initialized")
            ) {
              var productGrid = $(curTabContent.find(".collection-carousel"));
              var num = productGrid.find(".slick-slide").length,
                num_act = productGrid.find(".slick-active").length,
                num_first = productGrid
                  .find(".slick-active:first")
                  .data("slick-index"),
                num_last =
                  productGrid.find(".slick-active:last").data("slick-index") +
                  1,
                prev = productGrid
                  .parents("[data-product-tabs]")
                  .find(".nav-slider--prev"),
                next = productGrid
                  .parents("[data-product-tabs]")
                  .find(".nav-slider--next"),
                currentSlide = productGrid
                  .find(".slick-current")
                  .data("slick-index");
              productGrid
                .parents("[data-product-tabs]")
                .find(".total_nav")
                .text(Math.ceil(num / num_act));
              page = Math.ceil(((currentSlide || 0) + 1) / length);
              if (page > Math.ceil(num / num_act)) {
                page = Math.ceil(num / num_act);
              }
              productGrid
                .parents("[data-product-tabs]")
                .find(".current_nav")
                .text(page);
              if (num == num_act) {
                prev.css("visibility", "hidden");
                next.css("visibility", "hidden");
              } else {
                prev.css("visibility", "visible");
                next.css("visibility", "visible");
              }
              if (num_first == 0) {
                prev.addClass("disabled");
              } else {
                prev.removeClass("disabled");
              }
              if (num - num_last > 0) {
                next.removeClass("disabled");
              } else {
                next.addClass("disabled");
              }
            }
          }
        });
      });
    },

    doAjaxNovProductTabs: function (handle, curTabContent, tabLink) {
      $.ajax({
        type: "GET",
        url: window.router + handle,
        beforeSend: function () {
          tabLink.css({ "pointer-events": "none", opacity: "0.6" });
        },
        success: function (data) {
          if (
            handle == "/collections/?view=json" ||
            handle == "/collections/?view=new-json"
          ) {
          } else {
            curTabContent.html($(data).find(".grid-item").html());
            var limit = tabLink.data("limit") - 1;
            curTabContent.find(".block:gt(" + limit + ")").remove();
            if (curTabContent.hasClass("collection-carousel")) {
              if (!curTabContent.hasClass("slick-initialized")) {
                nuranium.initNovProductTabsSlider(curTabContent.parent());
              }
            }
            Currency.convertAll(
              shopCurrency,
              $("#currencies span.selected").attr("data-currency")
            );
            nuranium.initNovWishListIcons();

            setTimeout(function () {
              if (
                $(".shopify-product-reviews-badge").length &&
                $(".spr-badge").length
              ) {
                return (
                  window.SPR.registerCallbacks(),
                  window.SPR.initRatingHandler(),
                  window.SPR.initDomEls(),
                  window.SPR.loadProducts(),
                  window.SPR.loadBadges()
                );
              }
            }, 500);
          }
        },
        complete: function () {
          tabLink.css({ "pointer-events": "auto", opacity: "1" });
          if ($(".jdgm-prev-badge").length) {
            jdgm.customizeBadges();
          }
        },
      });
    },
    initNovProductTabsSlider: function (tabslider) {
      tabslider.each(function () {
        var self = $(this),
          productGrid = self.find(".products-grid"),
          t = !!$("html").hasClass("lang-rtl");

        if (productGrid.not(".slick-initialized")) {
          productGrid.on(
            "init reInit afterChange",
            function (event, slick, currentSlide) {
              const length = productGrid.find(".slick-active").length,
                page = Math.ceil(((currentSlide || 0) + 1) / length),
                numPages = Math.ceil(slick.slideCount / length);
              self
                .parents("[data-product-tabs]")
                .find(".current_nav")
                .text(`${page}`);
              self
                .parents("[data-product-tabs]")
                .find(".total_nav")
                .text(`${numPages}`);
              self
                .parents("[data-product-tabs]")
                .find(".num_nav")
                .css("opacity", "1");
            }
          );
          productGrid.slick({
            nextArrow:
              '<div class="arrow-next"><i class="rbb-icon-direction-39"></i></div>',
            prevArrow:
              '<div class="arrow-prev"><i class="rbb-icon-direction-36"></i></div>',
            rtl: t,
            slidesToShow: productGrid.data("items_xxl"),
            slidesToScroll: productGrid.data("items_xxl"),
            rows: productGrid.data("row"),
            row_mobile: productGrid.data("row_mobile"),
            arrows: productGrid.data("nav"),
            dots: productGrid.data("dots"),
            infinite: productGrid.data("loop"),
            adaptiveHeight: !0,
            responsive: [
              {
                breakpoint: 1440,
                settings: {
                  slidesToShow: productGrid.data("items"),
                  slidesToScroll: productGrid.data("items"),
                },
              },
              {
                breakpoint: 1200,
                settings: {
                  slidesToShow: productGrid.data("items_lg"),
                  slidesToScroll: productGrid.data("items_lg"),
                  arrows: false,
                },
              },
              {
                breakpoint: 992,
                settings: {
                  slidesToShow: productGrid.data("items_md"),
                  slidesToScroll: productGrid.data("items_md"),
                  arrows: false,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: productGrid.data("items_sm"),
                  slidesToScroll: productGrid.data("items_sm"),
                  arrows: false,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: productGrid.data("items_xs"),
                  slidesToScroll: productGrid.data("items_xs"),
                  arrows: !1,
                  rows: productGrid.data("row_mobile"),
                },
              },
            ],
          });
          var currentSlide = productGrid.slick("slickCurrentSlide");
          checkArrow(this, currentSlide);

          $(this).on(
            "afterChange",
            function (event, slick, currentSlide, nextSlide) {
              checkArrow(this, currentSlide);
            }
          );
          function checkArrow(el, current) {
            var num = $(el).find(".slick-slide").length,
              num_act = $(el).find(".slick-active").length,
              prev = $(el)
                .parents("[data-product-tabs]")
                .find(".nav-slider--prev"),
              next = $(el)
                .parents("[data-product-tabs]")
                .find(".nav-slider--next");
            if (num - num_act == 0) {
              prev.css("visibility", "hidden");
              next.css("visibility", "hidden");
            } else {
              prev.css("visibility", "visible");
              next.css("visibility", "visible");
            }
            if (current == 0) {
              prev.addClass("disabled");
            } else {
              prev.removeClass("disabled");
            }
            if (num - num_act <= current) {
              next.addClass("disabled");
            } else {
              next.removeClass("disabled");
            }
          }
          $("[data-product-tabs]")
            .find(".nav-slider--prev")
            .click(function () {
              $(this)
                .parents("[data-product-tabs]")
                .find(".tab-content.active")
                .find(productGrid)
                .slick("slickPrev");
            });
          $("[data-product-tabs]")
            .find(".nav-slider--next")
            .click(function () {
              $(this)
                .parents("[data-product-tabs]")
                .find(".tab-content.active")
                .find(productGrid)
                .slick("slickNext");
            });
        }
      });
    },
    productItemSwatch: function () {
      $(document).on("change", ".selector-wrapper :radio", function (e) {
        var _self = $(this);
        var product_item = _self.parents(".item-product");
        var item_swatch = _self.parents(".product__popup-swatch");
        var product_info = product_item.data("json-product");
        var variants = product_info.variants;
        var option_position = product_item
          .find(".opt-color")
          .data("opt-position");
        var option_index = _self
          .closest("[data-option-index]")
          .data("option-index");
        var el_swatch = item_swatch.find(".swatch-element");
        var variant_value = _self.val();
        var selected_variant;
        var productInput = item_swatch.find("[name=id]");
        var selected_swatch_opt1 = item_swatch
          .find(".selector-wrapper-1")
          .find("input:checked")
          .val();
        var selected_swatch_opt2 = item_swatch
          .find(".selector-wrapper-2")
          .find("input:checked")
          .val();
        var selected_swatch_opt3 = item_swatch
          .find(".selector-wrapper-3")
          .find("input:checked")
          .val();
        el_swatch.removeClass("soldout");
        el_swatch.find(":radio").prop("disabled", false);
        switch (option_index) {
          case 0:
            var available_variants = variants.find(function (variant) {
              if (option_position == 1) {
                return (
                  variant.option2 == variant_value &&
                  variant.option1 == selected_swatch_opt2
                );
              } else {
                if (option_position == 2) {
                  return (
                    variant.option3 == variant_value &&
                    variant.option1 == selected_swatch_opt2
                  );
                } else {
                  return (
                    variant.option1 == variant_value &&
                    variant.option2 == selected_swatch_opt2
                  );
                }
              }
            });

            if (available_variants != undefined) {
              selected_variant = available_variants;
            } else {
              var alt_available_variants = variants.find(function (variant) {
                if (option_position == 1) {
                  return variant.option2 == variant_value;
                } else {
                  if (option_position == 2) {
                    return variant.option3 == variant_value;
                  } else {
                    return variant.option1 == variant_value;
                  }
                }
              });
              selected_variant = alt_available_variants;
            }
            break;
          case 1:
            var available_variants = variants.find(function (variant) {
              if (option_position == 1) {
                return (
                  variant.option2 == selected_swatch_opt1 &&
                  variant.option1 == variant_value &&
                  variant.option3 == selected_swatch_opt3
                );
              } else {
                if (option_position == 2) {
                  return (
                    variant.option3 == selected_swatch_opt1 &&
                    variant.option1 == variant_value &&
                    variant.option2 == selected_swatch_opt3
                  );
                } else {
                  return (
                    variant.option1 == selected_swatch_opt1 &&
                    variant.option2 == variant_value &&
                    variant.option3 == selected_swatch_opt3
                  );
                }
              }
            });
            if (available_variants != undefined) {
              selected_variant = available_variants;
            } else {
              var alt_available_variants = variants.find(function (variant) {
                if (option_position == 1) {
                  return (
                    variant.option2 == selected_swatch_opt1 &&
                    variant.option1 == variant_value
                  );
                } else {
                  if (option_position == 2) {
                    return (
                      variant.option3 == selected_swatch_opt1 &&
                      variant.option1 == variant_value
                    );
                  } else {
                    return (
                      variant.option1 == selected_swatch_opt1 &&
                      variant.option2 == variant_value
                    );
                  }
                }
              });
              selected_variant = alt_available_variants;
            }
            break;
          case 2:
            var available_variants = variants.find(function (variant) {
              if (option_position == 1) {
                return (
                  variant.option2 == selected_swatch_opt1 &&
                  variant.option1 == selected_swatch_opt2 &&
                  variant.option3 == variant_value
                );
              } else {
                if (option_position == 2) {
                  return (
                    variant.option3 == selected_swatch_opt1 &&
                    variant.option1 == selected_swatch_opt2 &&
                    variant.option2 == variant_value
                  );
                } else {
                  return (
                    variant.option1 == selected_swatch_opt1 &&
                    variant.option2 == selected_swatch_opt2 &&
                    variant.option3 == variant_value
                  );
                }
              }
            });
            if (available_variants != undefined) {
              selected_variant = available_variants;
            }
            break;
        }
        if (selected_variant == undefined) return;
        productInput.val(selected_variant.id);
        if (selected_variant.compare_at_price > selected_variant.price) {
          product_item
            .find("[data-compare-price-grid]")
            .html(
              Shopify.formatMoney(
                selected_variant.compare_at_price,
                theme.moneyFormat
              )
            );
        } else {
          product_item.find("[data-compare-price-grid]").html("");
        }
        product_item
          .find("[data-price-grid]")
          .html(Shopify.formatMoney(selected_variant.price, theme.moneyFormat));
        _self
          .parents(".selector-wrapper")
          .find(".form-label span")
          .text(variant_value);
        nuranium.checkStatusSwatch(product_item, item_swatch);

        var current_variant_id = item_swatch
          .find(".current_variant_id")
          .attr("value");
        var inventory_policy = item_swatch
          .find('.product-form__variants [value="' + current_variant_id + '"]')
          .data("inventory_policy");
        if (inventory_policy == "continue") {
          item_swatch
            .find("[data-btn-addtocart] .add-to-cart-text")
            .text(window.inventory_text.preorder);
        } else {
          item_swatch
            .find("[data-btn-addtocart] .add-to-cart-text")
            .text(window.inventory_text.add_to_cart);
        }
        Currency.convertAll(
          shopCurrency,
          $("#currencies span.selected").attr("data-currency")
        );
      });
      $(document).on(
        "change",
        ".item-product__popup--variant select.single-option-selector",
        function () {
          var _self = $(this);
          var product_item = _self.parents(".item-product");
          var item_swatch = _self.parents(".product__popup-swatch");
          var product_info = product_item.data("json-product");
          var variants = product_info.variants;
          var option_index = _self.data("option");
          var pval = _self.val();
          var selected_variant;
          var productInput = item_swatch.find("[name=id]");
          var selected_swatch_opt1 = item_swatch
            .find('[data-option="option1"]')
            .val();
          var selected_swatch_opt2 = item_swatch
            .find('[data-option="option2"]')
            .val();
          var selected_swatch_opt3 = item_swatch
            .find('[data-option="option3"]')
            .val();
          switch (option_index) {
            case "option1":
              var available_variants = variants.find(function (variant) {
                return (
                  variant.option1 == pval &&
                  variant.option2 == selected_swatch_opt2 &&
                  variant.available
                );
              });
              if (available_variants != undefined) {
                selected_variant = available_variants;
              } else {
                var altAvailableVariants = variants.find(function (variant) {
                  return variant.option1 == pval && variant.available;
                });
                selected_variant = altAvailableVariants;
              }
              break;
            case "option2":
              var available_variants = variants.find(function (variant) {
                return (
                  variant.option1 == selected_swatch_opt1 &&
                  variant.option2 == pval &&
                  variant.available
                );
              });
              if (available_variants != undefined) {
                selected_variant = available_variants;
              }
              break;
            case "option3":
              var available_variants = variants.find(function (variant) {
                return (
                  variant.option1 == selected_swatch_opt1 &&
                  variant.option2 == selected_swatch_opt2 &&
                  variant.option3 == pval &&
                  variant.available
                );
              });
              if (available_variants != undefined) {
                selected_variant = available_variants;
              }
              break;
          }
          if (selected_variant != undefined) {
            productInput.val(selected_variant.id);
          }
          _self
            .parents(".selector-wrapper")
            .find(".form-label span")
            .text(pval);

          nuranium.checkStatusSwatch(product_item, item_swatch);
          var current_variant_id = item_swatch
            .find(".current_variant_id")
            .attr("value");
          var inventory_policy = item_swatch
            .find(
              '.product-form__variants [value="' + current_variant_id + '"]'
            )
            .data("inventory_policy");
          if (inventory_policy == "continue") {
            item_swatch
              .find("[data-btn-addtocart] .add-to-cart-text")
              .text(window.inventory_text.preorder);
          } else {
            item_swatch
              .find("[data-btn-addtocart] .add-to-cart-text")
              .text(window.inventory_text.add_to_cart);
          }
        }
      );
      $(document).on(
        "click",
        ".selector-wrapper .unavailable :radio",
        function (e) {
          var _self = $(this);
          _self
            .parents(".item-product")
            .find("[data-btn-addtocart]")
            .attr("disabled", "disabled");
        }
      );
    },
    initproductItemColorSwatch: function () {
      var item_swatch_el = ".item-swatch li label";
      body
        .off("click.toggleClass")
        .on("click.toggleClass", item_swatch_el, function () {
          var self = $(this);
          var title = self.attr("data-title").replace(/^\s+|\s+$/g, "");
          var product_item = self.closest(".item");

          self.parents(".item-swatch").find("li label").removeClass("active");
          self.addClass("active");
          var product_info = $(this)
            .parents(".item-product")
            .data("json-product");

          var href = product_item.find("a").attr("href");
          product_item
            .find(".product__label-color")
            .find("[data-change-title]")
            .text(title);
          if (self.data("with-one-option") != undefined) {
            var quantity = self.data("quantity");
            var inventory_policy = self.data("inventory_policy");
            product_item.find('[name="id"]').val(self.data("with-one-option"));
            if (quantity > 0) {
              product_item
                .find("[data-btn-addtocart]")
                .removeClass("disabled")
                .removeAttr("disabled");
              if (inventory_policy == "continue") {
                product_item
                  .find("[data-btn-addtocart] .add-to-cart-text")
                  .text(window.inventory_text.preorder);
              } else {
                product_item
                  .find("[data-btn-addtocart] .add-to-cart-text")
                  .text(window.inventory_text.add_to_cart);
              }
            } else {
              product_item
                .find("[data-btn-addtocart]")
                .addClass("disabled")
                .attr("disabled", "disabled");
              product_item
                .find("[data-btn-addtocart] .add-to-cart-text")
                .text(window.inventory_text.sold_out);
            }
            var price = self.data("price"),
              comparePrice = self.data("compare_at_price");
            if (comparePrice > price) {
              product_item
                .find("[data-compare-price-grid]")
                .html(Shopify.formatMoney(comparePrice, theme.moneyFormat));
            } else {
              product_item.find("[data-compare-price-grid]").html("");
            }
            product_item
              .find("[data-price-grid]")
              .html(Shopify.formatMoney(price, theme.moneyFormat));
            Currency.convertAll(
              shopCurrency,
              $("#currencies span.selected").attr("data-currency")
            );
          } else {
            if (product_info != undefined) {
              nuranium.checkStatusSwatch(self.parents(".item-product"));
            }
            if ($(".template-collection").length) {
              if (
                self.parents(".product-collection").hasClass("products-list")
              ) {
                product_item
                  .find(".product-details")
                  .find('[data-value="' + title + '"]')
                  .find("label")
                  .trigger("click");
              } else {
                product_item
                  .find(".product__popup-swatch:eq(0)")
                  .find('[data-value="' + title + '"]')
                  .find("label")
                  .trigger("click");
              }
            } else {
              product_item
                .find('[data-value="' + title + '"]')
                .find("label")
                .trigger("click");
            }
          }

          var new_image = self.data("img");
          if (new_image) {
            product_item
              .find(
                ".thumbnail-container .product__thumbnail, .thumbnail-container .product__thumbnail-second"
              )
              .attr({
                "data-srcset": new_image,
                "data-src": new_image,
                src: new_image,
                srcset: new_image,
              });
            return false;
          }
        });

      body
        .off("click.showmore")
        .on("click.showmore", ".item-swatch-more .show_more", function (e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).parents(".item-swatch").toggleClass("show--more");
          $(this).parents(".item-swatch").hasClass("show--more")
            ? $(this).children().text("-")
            : $(this).children().text("+");
        });
    },
    checkStatusSwatch: function (product_item, item_swatch) {
      if (window.use_color_swatch) {
        var product_info = product_item.data("json-product");
        var variants = product_info.variants;
        var options = product_item.find("[data-option-index]");
        var opt_position = product_item.find(".opt-color").data("opt-position");
        if (item_swatch == undefined) {
          item_swatch = product_item;
        }
        var selected_swatch_opt1 = item_swatch
          .find('[data-option-index="0"]')
          .find("input:checked")
          .val();
        var selected_swatch_opt2 = item_swatch
          .find('[data-option-index="1"]')
          .find("input:checked")
          .val();
        var selected_swatch_opt3 = item_swatch
          .find('[data-option-index="2"]')
          .find("input:checked")
          .val();

        options.each(function () {
          var option_index = $(this).data("option-index");
          var item_el = $(this).find(".swatch-element");
          switch (option_index) {
            case 0:
              item_el.each(function () {
                var swatch_val = $(this).data("value");
                var opt1_soldout = variants.find(function (variant) {
                  if (opt_position == 1) {
                    return variant.option2 == swatch_val && variant.available;
                  } else {
                    if (opt_position == 2) {
                      return variant.option3 == swatch_val && variant.available;
                    } else {
                      return variant.option1 == swatch_val && variant.available;
                    }
                  }
                });
                var option_unavailable = variants.find(function (variant) {
                  if (opt_position == 1) {
                    return variant.option2 == swatch_val;
                  } else {
                    if (opt_position == 2) {
                      return variant.option3 == swatch_val;
                    } else {
                      return variant.option1 == swatch_val;
                    }
                  }
                });
                if (opt1_soldout == undefined) {
                  if (option_unavailable == undefined) {
                    $(this).addClass("unavailable");
                    $(this).removeClass("soldout");
                    $(this).removeClass("available");
                    $(this).find(":radio").prop("checked", false);
                    $(this).attr("data-toggle", "modal");
                    $(this).attr("data-target", "#Form_newletter");
                  } else {
                    $(this).addClass("soldout");
                    $(this).removeClass("unavailable");
                    $(this).removeClass("available");
                    $(this).find(":radio").prop("disabled", false);
                    $(this).attr("data-toggle", "modal");
                    $(this).attr("data-target", "#Form_newletter");
                  }
                } else {
                  $(this).removeClass("soldout");
                  $(this).removeClass("unavailable");
                  $(this).addClass("available");
                  $(this).find(":radio").prop("disabled", false);
                  $(this).removeAttr("data-toggle", "modal");
                  $(this).removeAttr("data-target", "#Form_newletter");
                }
              });
              break;
            case 1:
              item_el.each(function () {
                var swatch_val = $(this).data("value");
                var opt1_soldout = variants.find(function (variant) {
                  if (opt_position == 1) {
                    return (
                      variant.option2 == selected_swatch_opt1 &&
                      variant.option1 == swatch_val &&
                      variant.available
                    );
                  } else {
                    if (opt_position == 2) {
                      return (
                        variant.option3 == selected_swatch_opt1 &&
                        variant.option1 == swatch_val &&
                        variant.available
                      );
                    } else {
                      return (
                        variant.option1 == selected_swatch_opt1 &&
                        variant.option2 == swatch_val &&
                        variant.available
                      );
                    }
                  }
                });
                var option_unavailable = variants.find(function (variant) {
                  if (opt_position == 1) {
                    return (
                      variant.option2 == selected_swatch_opt1 &&
                      variant.option1 == swatch_val
                    );
                  } else {
                    if (opt_position == 2) {
                      return (
                        variant.option3 == selected_swatch_opt1 &&
                        variant.option1 == swatch_val
                      );
                    } else {
                      return (
                        variant.option1 == selected_swatch_opt1 &&
                        variant.option2 == swatch_val
                      );
                    }
                  }
                });
                if (opt1_soldout == undefined) {
                  if (option_unavailable == undefined) {
                    $(this).addClass("unavailable");
                    $(this).removeClass("soldout");
                    $(this).removeClass("available");
                    $(this).find(":radio").prop("checked", false);
                    $(this).attr("data-toggle", "modal");
                    $(this).attr("data-target", "#Form_newletter");
                  } else {
                    $(this).addClass("soldout");
                    $(this).removeClass("unavailable");
                    $(this).removeClass("available");
                    $(this).find(":radio").prop("disabled", false);
                    $(this).attr("data-toggle", "modal");
                    $(this).attr("data-target", "#Form_newletter");
                  }
                } else {
                  $(this).removeClass("soldout");
                  $(this).removeClass("unavailable");
                  $(this).addClass("available");
                  $(this).find(":radio").prop("disabled", false);
                  $(this).removeAttr("data-toggle", "modal");
                  $(this).removeAttr("data-target", "#Form_newletter");
                }
              });
              break;
            case 2:
              item_el.each(function () {
                var swatch_val = $(this).data("value");
                var swatch_inventory_policy = $(this).data("inventory_policy");
                var opt1_soldout = variants.find(function (variant) {
                  if (opt_position == 1) {
                    return (
                      variant.option2 == selected_swatch_opt1 &&
                      variant.option1 == selected_swatch_opt2 &&
                      variant.option3 == swatch_val &&
                      variant.available
                    );
                  } else {
                    if (opt_position == 2) {
                      return (
                        variant.option3 == selected_swatch_opt1 &&
                        variant.option1 == selected_swatch_opt2 &&
                        variant.option2 == swatch_val &&
                        variant.available
                      );
                    } else {
                      return (
                        variant.option1 == selected_swatch_opt1 &&
                        variant.option2 == selected_swatch_opt2 &&
                        variant.option3 == swatch_val &&
                        variant.available
                      );
                    }
                  }
                });
                var option_unavailable = variants.find(function (variant) {
                  if (opt_position == 1) {
                    return (
                      variant.option2 == selected_swatch_opt1 &&
                      variant.option1 == selected_swatch_opt2 &&
                      variant.option3 == swatch_val
                    );
                  } else {
                    if (opt_position == 2) {
                      return (
                        variant.option3 == selected_swatch_opt1 &&
                        variant.option1 == selected_swatch_opt2 &&
                        variant.option2 == swatch_val
                      );
                    } else {
                      return (
                        variant.option1 == selected_swatch_opt1 &&
                        variant.option2 == selected_swatch_opt2 &&
                        variant.option3 == swatch_val
                      );
                    }
                  }
                });
                if (opt1_soldout == undefined) {
                  if (option_unavailable == undefined) {
                    $(this).addClass("unavailable");
                    $(this).removeClass("soldout");
                    $(this).removeClass("available");
                    $(this).find(":radio").prop("checked", false);
                    $(this).attr("data-toggle", "modal");
                    $(this).attr("data-target", "#Form_newletter");
                  } else {
                    $(this).addClass("soldout");
                    $(this).removeClass("unavailable");
                    $(this).removeClass("available");
                    $(this).find(":radio").prop("disabled", false);
                    $(this).attr("data-toggle", "modal");
                    $(this).attr("data-target", "#Form_newletter");
                  }
                } else {
                  $(this).removeClass("soldout");
                  $(this).removeClass("unavailable");
                  $(this).addClass("available");
                  $(this).find(":radio").prop("disabled", false);
                  $(this).removeAttr("data-toggle", "modal");
                  $(this).removeAttr("data-target", "#Form_newletter");
                }
              });
              break;
          }
        });
        if (
          item_swatch.find(".swatch-element.soldout").find("input:checked")
            .length
        ) {
          item_swatch.find("[data-btn-addtocart]").attr("disabled", true);
        } else {
          item_swatch.find("[data-btn-addtocart]").removeAttr("disabled");
        }
        item_swatch.find(".selector-wrapper:not(.opt-color)").each(function () {
          if (
            $(this).find(".swatch-element").find("input:checked").length < 1
          ) {
            if ($(this).find(".swatch-element.available").length) {
              $(this)
                .find(".swatch-element.available")
                .eq("0")
                .find("label")
                .trigger("click");
            } else {
              $(this)
                .find(".swatch-element.soldout")
                .eq("0")
                .find("label")
                .trigger("click");
            }
          }
        });
      } else {
        var product_info = product_item.data("json-product");
        var variants = product_info.variants;
        var options = product_item.find(
          ".item-product__popup--variant [data-option]"
        );
        var selected_swatch_opt1 = item_swatch
          .find('.item-product__popup--variant [data-option="option1"]')
          .val();
        var selected_swatch_opt2 = item_swatch
          .find('.item-product__popup--variant [data-option="option2"]')
          .val();
        var selected_swatch_opt3 = item_swatch
          .find('.item-product__popup--variant [data-option="option3"]')
          .val();

        options.each(function () {
          var option_index = $(this).data("option-index");
          var swatch_el = $(this).find("option");
          switch (option_index) {
            case 0:
              swatch_el.each(function () {
                var swatch_val = $(this).val();
                var opt1_soldout = variants.find(function (variant) {
                  return variant.option1 == swatch_val && variant.available;
                });
                if (opt1_soldout == undefined) {
                  var option_unavailable = variants.find(function (variant) {
                    return variant.option1 == swatch_val;
                  });
                  if (option_unavailable == undefined) {
                    $(this).addClass("unavailable");
                    $(this).removeClass("soldOut");
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).addClass("soldOut");
                    $(this).removeClass("unavailable");
                    $(this).removeAttr("disabled", "disabled");
                  }
                } else {
                  $(this).removeAttr("disabled", "disabled");
                  $(this).removeClass("soldOut");
                  $(this).removeClass("unavailable");
                }
              });
              break;

            case 1:
              swatch_el.each(function () {
                var swatch_val = $(this).val();
                var opt1_soldout = variants.find(function (variant) {
                  return (
                    variant.option1 == selected_swatch_opt1 &&
                    variant.option2 == swatch_val &&
                    variant.available
                  );
                });
                if (opt1_soldout == undefined) {
                  var option_unavailable = variants.find(function (variant) {
                    return (
                      variant.option1 == selected_swatch_opt1 &&
                      variant.option2 == swatch_val
                    );
                  });
                  if (option_unavailable == undefined) {
                    $(this).addClass("unavailable");
                    $(this).removeClass("soldOut");
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).addClass("soldOut");
                    $(this).removeClass("unavailable");
                    $(this).removeAttr("disabled", "disabled");
                  }
                } else {
                  $(this).removeAttr("disabled", "disabled");
                  $(this).removeClass("soldOut");
                  $(this).removeClass("unavailable");
                }
              });
              break;

            case 2:
              swatch_el.each(function () {
                var swatch_val = $(this).val();
                var opt1_soldout = variants.find(function (variant) {
                  return (
                    variant.option1 == selected_swatch_opt1 &&
                    variant.option2 == selected_swatch_opt2 &&
                    variant.option3 == swatch_val &&
                    variant.available
                  );
                });
                if (opt1_soldout == undefined) {
                  var option_unavailable = variants.find(function (variant) {
                    return (
                      variant.option1 == selected_swatch_opt1 &&
                      variant.option2 == selected_swatch_opt2 &&
                      variant.option3 == swatch_val
                    );
                  });
                  if (option_unavailable == undefined) {
                    $(this).addClass("unavailable");
                    $(this).removeClass("soldOut");
                    $(this).attr("disabled", "disabled");
                  } else {
                    $(this).addClass("soldOut");
                    $(this).removeClass("unavailable");
                    $(this).removeAttr("disabled", "disabled");
                  }
                } else {
                  $(this).removeAttr("disabled", "disabled");
                  $(this).removeClass("soldOut");
                  $(this).removeClass("unavailable");
                }
              });
              break;
          }
        });
        if (
          item_swatch
            .find(".item-product__popup--variant .single-option-selector")
            .find("option.soldOut:selected").length
        ) {
          item_swatch
            .find("[data-btn-addtocart]")
            .addClass("disabled")
            .attr("disabled", true);
        } else {
          item_swatch
            .find("[data-btn-addtocart]")
            .removeClass("disabled")
            .removeAttr("disabled");
        }
      }
    },
    initNovWishListsPage: function () {
      if (typeof Storage !== "undefined") {
        if (wishListsArr.length <= 0) {
          return;
        }

        wishListsArr.forEach(function (item) {
          nuranium.createNovWishListTplItem(item);
        });
      } else {
        alert("Storage no support!");
      }
    },

    initNovWishListIcons: function () {
      if (!wishListsArr.length) {
        return;
      }

      for (var i = 0; i < wishListsArr.length; i++) {
        var icon = $('[data-product-handle="' + wishListsArr[i] + '"]');
        icon.addClass("whislist-added");
        icon.find(".wishlist-text").text(theme.strings.remove_wishlist);
      }

      if (typeof Storage !== "undefined") {
        if (wishListsArr.length <= 0) {
          return;
        }

        setTimeout(function () {
          wishListsArr.forEach(function (item) {
            nuranium.setNovAddedForWishlistIcon(item);
          });
        }, 1000);
      } else {
        alert("Storage no support!");
      }
    },

    setNovAddedForWishlistIcon: function (ProductHandle) {
      var wishlistElm = $('[data-product-handle="' + ProductHandle + '"]');
      var textadd = theme.strings.addto_wishlist;
      var textremove = theme.strings.remove_wishlist;
      idxArr = wishListsArr.indexOf(ProductHandle);
      $(".WishlistCount span").text(wishListsArr.length);
      if (idxArr >= 0) {
        wishlistElm.addClass("whislist-added");
        wishlistElm.find(".wishlist-text").text(textremove);
        wishlistElm.attr("title", textremove);
      } else {
        wishlistElm.removeClass("whislist-added");
        wishlistElm.find(".wishlist-text").text(textadd);
        wishlistElm.attr("title", textadd);
      }
    },

    doAddOrRemoveWishlist: function () {
      var iconWishLists = ".item-product [data-icon-wishlist]";
      var textadd = theme.strings.addto_wishlist;
      var textremove = theme.strings.remove_wishlist;

      $(document)
        .off("click.addOrRemoveWishlist", iconWishLists)
        .on("click.addOrRemoveWishlist", iconWishLists, function (e) {
          e.preventDefault();
          var self = $(this),
            productId = self.data("id"),
            ProductHandle = self.data("product-handle"),
            idxArr = wishListsArr.indexOf(ProductHandle);

          if (!self.hasClass("whislist-added")) {
            self.addClass("whislist-added");
            self.find(".wishlist-text").text(textremove);
            self.attr({ title: textremove, "data-original-title": textremove });
            $(".tooltip-inner").text(textremove);

            var title = self
              .parents(".item-product")
              .find(".product__title")
              .html();
            var image = self
              .parents(".item-product")
              .find(".product__thumbnail")
              .attr("srcset")
              ? self
                  .parents(".item-product")
                  .find(".product__thumbnail")
                  .attr("srcset")
              : self
                  .parents(".item-product")
                  .find(".product__thumbnail")
                  .attr("src");

            $(".loading-modal").find(".product-title").html(title);
            $(".loading-modal").find(".product-image").attr("srcset", image);
            $(".loading-modal").find(".btn-wishlist").show();
            $(".loading-modal").css({
              opacity: "1",
              visibility: "initial",
              transform: "translateX(0)",
              transition: "all 0.3s",
            });
            $(".loading-modal").addClass("novload");
            setTimeout(function () {
              $(".loading-modal").css({
                opacity: "0",
                visibility: "hidden",
                transform: "translateX(410px)",
                transition: "all 0.3s",
              });
              $(".loading-modal").removeClass("novload");
            }, 5000);

            if ($("[data-wishlist-container]").length) {
              nuranium.createNovWishListTplItem(ProductHandle);
            }

            wishListsArr.push(ProductHandle);
            localStorage.setItem("wishListsArr", JSON.stringify(wishListsArr));
          } else {
            self.removeClass("whislist-added");
            self.find(".wishlist-text").text(textadd);
            self.attr({ title: textadd, "data-original-title": textadd });
            $(".tooltip-inner").text(textadd);
            if (
              $('[data-wishlist-added="wishlist-' + productId + '"]').length
            ) {
              $('[data-wishlist-added="wishlist-' + productId + '"]').remove();
            }

            wishListsArr.splice(idxArr, 1);
            localStorage.setItem("wishListsArr", JSON.stringify(wishListsArr));
          }

          nuranium.setNovAddedForWishlistIcon(ProductHandle);
        });
    },

    doAddOrRemoveWishlistProduct: function () {
      var iconWishLists = ".product-single a[data-icon-wishlist]";

      $(document)
        .off("click.addOrRemoveWishlist", iconWishLists)
        .on("click.addOrRemoveWishlist", iconWishLists, function (e) {
          e.preventDefault();

          var self = $(this),
            productId = self.data("id"),
            ProductHandle = self.data("product-handle"),
            idxArr = wishListsArr.indexOf(ProductHandle);

          if (!self.hasClass("whislist-added")) {
            self.addClass("whislist-added");
            self.find(".wishlist-text").text(theme.strings.remove_wishlist);

            var title = self
              .parents(".product-single")
              .find(".product-single__title")
              .html();
            var image = self
              .parents(".product-single")
              .find(".product-single__photos .thumblist .thumbItem img")
              .attr("src");
            $(".loading-modal").find(".product-title").html(title);
            $(".loading-modal").find(".product-image").attr("src", image);
            $(".loading-modal").find(".btn-wishlist").show();
            $(".loading-modal").css({
              opacity: "1",
              visibility: "initial",
              transform: "translateX(0)",
              transition: "all 0.3s",
            });
            $(".loading-modal").addClass("novload");
            setTimeout(function () {
              $(".loading-modal").css({
                opacity: "0",
                visibility: "hidden",
                transform: "translateX(410px)",
                transition: "all 0.3s",
              });
              $(".loading-modal").removeClass("novload");
            }, 5000);

            if ($("[data-wishlist-container]").length) {
              nuranium.createNovWishListTplItem(ProductHandle);
            }

            wishListsArr.push(ProductHandle);
            localStorage.setItem("wishListsArr", JSON.stringify(wishListsArr));
          } else {
            self.removeClass("whislist-added");
            self.find(".wishlist-text").text(theme.strings.addto_wishlist);
            if (
              $('[data-wishlist-added="wishlist-' + productId + '"]').length
            ) {
              $('[data-wishlist-added="wishlist-' + productId + '"]').remove();
            }

            wishListsArr.splice(idxArr, 1);
            localStorage.setItem("wishListsArr", JSON.stringify(wishListsArr));
          }

          nuranium.setNovAddedForWishlistIcon(ProductHandle);
        });
    },

    createNovWishListTplItem: function (ProductHandle) {
      var wishListCotainer = $("[data-wishlist-container]");

      jQuery.getJSON(
        window.router + "/products/" + ProductHandle + ".js",
        function (product) {
          var productHTML = "",
            price_min = Shopify.formatMoney(
              product.price_min,
              theme.moneyFormat
            ),
            compare_at_price_min = Shopify.formatMoney(
              product.compare_at_price_min,
              theme.moneyFormat
            ),
            variants = JSON.stringify(product.variants),
            media = JSON.stringify(product.media);

          productHTML +=
            '<div class="item col-lg-3 col-md-4 col-6" data-wishlist-added="wishlist-' +
            product.id +
            '">';
          productHTML +=
            '<div class="item-product" data-product-id="product-' +
            product.handle +
            '">';
          productHTML += '<div class="inner-top">';
          if (typeof product.images[1] !== "undefined") {
            productHTML +=
              '<div class="product-top thumbnail-container has-multiimage">';
          } else {
            productHTML += '<div class="product-top thumbnail-container">';
          }
          productHTML += '<a href="' + product.url + '">';
          productHTML +=
            '<img class="product__thumbnail" src="' +
            product.featured_image +
            '" alt="' +
            product.featured_image.alt +
            '">';
          if (typeof product.images[1] !== "undefined") {
            productHTML +=
              '<img class="product__thumbnail-second" src="' +
              product.images[1] +
              '" alt="' +
              product.images[1].alt +
              '">';
          }
          productHTML += "</a>";
          productHTML += '<div class="button--top">';
          productHTML += '<div class="productWishList">';
          productHTML +=
            '<a class="btnProductWishlist item-product__wishlist whislist-added" data-icon-wishlist href="#" data-product-handle="' +
            product.handle +
            '" data-id="' +
            product.id +
            '">';
          productHTML += '<i class="zmdi zmdi-favorite"></i>';
          productHTML += "</a>";
          productHTML += "</div>";
          productHTML += '<div class="productQuickView d-none d-md-block">';
          productHTML +=
            '<a class="btnProductQuickview" href="#" data-url="/products/' +
            product.handle +
            '?view=quick_view" data-product-url="/products/' +
            product.handle +
            '"  data-handle="' +
            product.handle +
            '" data-pid="' +
            product.id +
            '">';
          productHTML += '<i class="zmdi zmdi-collection-image-o"></i>';
          productHTML += "</a>";
          productHTML += "</div>";

          productHTML += "</div>";
          productHTML += "</div>";
          productHTML += '<div class="product__info">';
          productHTML +=
            '<div class="product__title"><a href="' +
            product.url +
            '" title="' +
            product.title +
            '">' +
            product.title +
            "</a></div>";
          if (compare_at_price_min > price_min) {
            productHTML += '<div class="price-sale">';
            productHTML +=
              '<span class="special-price" data-price-grid>' +
              price_min +
              "</span>";
            productHTML +=
              '<span class="old-price" data-compare-price-grid>' +
              compare_at_price_min +
              "</span>";
            productHTML += "</div>";
          } else {
            productHTML += '<div class="price-regular">';
            productHTML += "<span data-price-grid>" + price_min + "</span>";
            productHTML += "</div>";
          }
          productHTML += "</div></div></div>";

          wishListCotainer.append(productHTML);
        }
      );
    },

    ajaxAddToCart: function () {
      $(document).on("click", "button.btnAddToCart", function (e) {
        var $this = $(this);
        e.preventDefault();
        $this.css("pointer-events", "none").addClass("loading");
        $.ajax({
          type: "POST",
          url: "/cart/add.js",
          data: $this.parents("form").serialize(),
          dataType: "json",
          success: function (cart) {
            $.get("/cart?view=json", function (data) {
              $("#cart-info").html(data);
            }).always(function () {
              Currency.convertAll(
                shopCurrency,
                $("#currencies span.selected").attr("data-currency")
              );

              if (theme.cart_status == "show_popup") {
                nuranium.initAddToCart(cart.image, cart.title);
              }
              if (!$(".form-cart__extent").length) {
                nuranium.initCartExtend();
              }

              nuranium.updateMiniCart();

              nuranium.PopupAddToCart();
              $this
                .parents("form")
                .find(".product-form__item-error")
                .addClass("hidden");
              $this.css("pointer-events", "auto").removeClass("loading");
              $(document).find(".quickviewClose").trigger("click");
              if (theme.cart_status == "show_minicart") {
                setTimeout(function () {
                  $("#desktop_cart").addClass("active");
                  $(".sidebar-overlay").addClass("act");
                }, 300);
              }
            });
          },
          error: function (XMLHttpRequest, textStatus) {
            $this.removeClass("loading").css("pointer-events", "auto");
            $this
              .parents("form")
              .find(".product-form__item-error")
              .removeClass("hidden");
          },
        });
      });
    },

    initAddToCart: function (image, title) {
      $.ajax({
        url: "/cart/?view=upsell",
        dataType: "html",
        type: "GET",
        beforeSend: function () {
          $("body").addClass("cart_popup_opened");
        },
        success: function (data) {
          $.magnificPopup.open({
            items: {
              src:
                '<div class="nov-with-anim product-quickview popup-quick-view cart__popup cart__popup_upsell"><div id="content_cart__popup_nt">' +
                data +
                "</div></div>",
              type: "inline",
            },
            removalDelay: 500,
            closeMarkup: '<i class="zmdi zmdi-hc-fw zmdi-close"></i>',
            callbacks: {
              beforeOpen: function () {
                this.st.mainClass = "nov-move-horizontal";
              },
              open: function () {
                nuranium.PopupAddToCart();
                Currency.convertAll(
                  shopCurrency,
                  $("#currencies span.selected").attr("data-currency")
                );
              },
              change: function () {},
              close: function () {
                if ($("body").hasClass("template-cart")) {
                  window.location.reload();
                } else {
                  $("body").removeClass("cart_popup_opened");
                  $("body").removeClass("open_quick_variants");
                  $("body").removeClass("loading");
                  $("#content_cart__popup_nt").empty();
                }
              },
            },
          });
        },
        complete: function () {
          nuranium.PopupAddToCart();
          Currency.convertAll(
            shopCurrency,
            $("#currencies span.selected").attr("data-currency")
          );
          $(".loader").remove();
          if (title) {
            var cartMessage =
              '<div class="cart-message d-flex align-items-center mb-20">' +
              '<i class="zmdi zmdi-notifications-active"></i><strong>' +
              title +
              "</strong> - " +
              theme.strings.cart_message_html +
              "</div>";
            $(".cart-popup__content").prepend(cartMessage);
          }
        },
        error: function () {
          $(".loader").remove();
        },
      });
    },

    updateMiniCart: function () {
      Shopify.getCart(function (cart) {
        nuranium.doUpdateMiniCart(cart);
      });
    },

    doUpdateMiniCart: function (cart) {
      $("#CartCount, #CartCountCavas").text(cart.item_count);
      $("#cart_total").html(
        Shopify.formatMoney(cart.total_price, theme.moneyFormat)
      );
      $(".cart-popup-heading span").html(
        "There are " + cart.item_count + " item(s) in your cart"
      );
    },

    ajaxChangeFromCart: function () {
      $(document).on(
        "change",
        ".cart__popup-qty--input, .cart__mini-qty--input",
        function (e) {
          e.preventDefault();
        }
      );
    },

    PopupAddToCart: function () {
      function PopupUpdateCart(_id, new_qty) {
        $(".cart__popup").addClass("loading");
        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: "quantity=" + new_qty + "&id=" + _id,
          dataType: "json",
          success: function (cart) {
            jQuery
              .get("/cart?view=up_ajax", function (data) {
                data = jQuery(data);
                var sdata = jQuery(data);
                var t_html = jQuery(sdata.get(0)).html(),
                  t_threshold = jQuery(sdata.get(2)).html(),
                  t_total = $(".cart__popup #" + _id).find(
                    ".cart__popup-total .amount"
                  );

                $(".cart__popup #" + _id)
                  .find(".cart__popup-qty--input")
                  .val(new_qty);

                var price = parseFloat(t_total.data("price")) * new_qty;
                t_total.html(Shopify.formatMoney(price, theme.moneyFormat));
                $("#cart__popup_total").html(t_html);
                $("#threshold_bar_popup").html(t_threshold);
              })
              .always(function () {
                Currency.convertAll(
                  shopCurrency,
                  $("#currencies span.selected").attr("data-currency")
                );
                $(".cart__popup").removeClass("loading");
              });

            $.get("/cart?view=json", function (data) {
              $("#cart-info").html(data);
            }).always(function () {
              Currency.convertAll(
                shopCurrency,
                $("#currencies span.selected").attr("data-currency")
              );
              nuranium.updateMiniCart();
            });
          },
          error: function (XMLHttpRequest, textStatus) {
            $(".cart__popup").removeClass("loading");
          },
        });
      }

      $(document).on("click", ".cart__popup-qty", function (e) {
        e.preventDefault();
        var $this = $(this),
          $qty = $this.siblings(".cart__popup-qty--input"),
          $id = $qty.attr("data-id"),
          $qtyinput = parseFloat($qty.val()),
          $step = parseFloat($qty.attr("step")),
          $min = parseFloat($qty.attr("min")),
          $max = parseFloat($qty.attr("max"));

        if ($this.hasClass("cart__popup-qty--plus")) {
          var $newqty = $qtyinput + $step;
          if ($newqty > $max && $max > 0) {
            $qty.val($max);
            return;
          }
        } else if ($this.hasClass("cart__popup-qty--minus")) {
          var $newqty = $qtyinput - $step;
          if ($newqty === 0) {
            var last_qty = parseInt($qty.attr("value"));
            $qty.val(last_qty);
            $this
              .parents(".cart__popup-item")
              .find(".cart__popup-remove")
              .trigger("click");
            return;
          } else if ($newqty < $min) {
            return;
          } else if ($qtyinput < 0) {
            alert("Invalid");
            return;
          }
        }

        PopupUpdateCart($id, $newqty);
      });

      $(document).on("click", ".cart__popup-remove", function (e) {
        e.preventDefault();

        $(".cart__popup").addClass("loading");

        var $this = $(this),
          $qty = $this
            .siblings(".cart__popup-quantity")
            .find(".cart__popup-qty--input"),
          $id = $this.find("a").attr("data-product-id"),
          $qtyinput = parseInt($qty.val());
        $ptitle = $this
          .parent(".cart__popup-item")
          .find(".cart__popup-title a")
          .text();

        $(".cart__popup").addClass("loading");

        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: "quantity=0&id=" + $id,
          dataType: "json",
          success: function (cart) {
            jQuery
              .get("/cart?view=up_ajax", function (data) {})
              .always(function (data) {
                data = jQuery(data);
                var sdata = jQuery(data);
                var t_html = jQuery(sdata.get(0)).html(),
                  t_threshold = jQuery(sdata.get(2)).html();
                $("#cart__popup_total").html(t_html);
                $("#threshold_bar_popup").html(t_threshold);
                $(".cart__popup #" + $id).addClass("hide");
                if ($qtyinput > 0) {
                  $("#" + $id + " input").val($qtyinput);
                } else {
                  $(".cart__popup #" + $id + " input").val(1);
                }

                Currency.convertAll(
                  shopCurrency,
                  $("#currencies span.selected").attr("data-currency")
                );

                $(".cart__popup .cart-message").html(
                  '<i class="rbb-icon-delete-outline-2"></i> <strong>' +
                    $ptitle +
                    "</strong> - has been removed into your shopping cart."
                );

                $(".cart__popup .cart-message")
                  .removeClass("removed")
                  .addClass("removed");

                $(".cart__popup").removeClass("loading");

                $this.parents(".cart__popup-item").remove();
              });

            $.get("/cart?view=json", function (data) {
              $("#cart-info").html(data);
            }).always(function () {
              Currency.convertAll(
                shopCurrency,
                $("#currencies span.selected").attr("data-currency")
              );

              nuranium.updateMiniCart();
            });
          },
        });
      });
    },

    initMiniCart: function () {
      jQuery.getJSON("/cart.js", function (cart) {
        $("#CartCount, #CartCountCavas").text(cart.item_count);
        $("#cart-info").html("");
        $("#desktop_cart").addClass("item_count");
        if (cart.item_count > 0) {
          var html = "";
          html += '<form action="/cart" method="post" class="cart ajaxcart">';
          html +=
            '<input class="js-form-discount" type="hidden" name="discount" value="">';
          html += '<div class="ajaxcart__inner">';
          html += '<div class="ajaxcart__inner--content">';
          for (var i = 0; i < cart.items.length; i++) {
            var image = Shopify.resizeImage(cart.items[i].image, "220x");
            var price = Shopify.formatMoney(
              cart.items[i].price,
              theme.moneyFormat
            );

            html += '<div class="ajaxcart__product" data-line="' + i + '">';
            html += '<div class="media">';
            html +=
              '<a href="' + cart.items[i].url + '" class="position-relative">';
            html +=
              '<img class="d-flex product-image" src="' +
              image +
              '" alt="' +
              cart.items[i].title +
              '" title="' +
              cart.items[i].title +
              '">';
            html += "</a>";
            html += '<div class="media-body">';
            html += '<a class="product-name" href="' + cart.items[i].url + '">';
            html +=
              '<span class="title">' + cart.items[i].product_title + "</span>";
            if (cart.items[i].variant_title)
              html +=
                '<span class="bt_s">' + cart.items[i].variant_title + "</span>";
            html += "</a>";
            html += '<div class="mb-5"></div>';
            html +=
              '<span class="product-price"><span class="money">' +
              price +
              "</span></span>";
            //html += '<span class="quantity"> x '+cart.items[i].quantity+'</span>';

            html +=
              '<div class="cart__item-bottom d-flex align-items-center mt-10">';
            html += '<div class="cart__mini--qty d-flex align-items-center">';
            html +=
              '<a class="cart__mini-qty cart__mini-qty--minus" href="#">-</a>';
            html +=
              '<input class="cart__mini-qty--input" type="number" name="updates[]" id="updates_' +
              cart.items[i].key +
              '" data-price="' +
              cart.items[i].price +
              '" data-id="' +
              cart.items[i].id +
              '" data-line="' +
              i +
              '" step="1" value="' +
              cart.items[i].quantity +
              '" min="1" max="" pattern="[0-9]*" />';
            html +=
              '<a class="cart__mini-qty cart__mini-qty--plus" href="#">+</a>';
            html += "</div>";
            html +=
              '<span class="remove-from-cart" rel="nofollow" href="#" title="remove from cart" data-line="' +
              i +
              '" data-product-id="' +
              cart.items[i].id +
              '"><i class="rbb-icon-delete-outline-2"></i></span>';
            html += "</div>";

            html += "</div>";
            html += "</div>";
            html += "</div>";
          }
          html += "</div>";
          html += "</div>";

          html += '<div class="ajaxcart__footer">';
          html +=
            '<div class="subtotal d-flex align-items-center justify-content-between">';
          html += "<label>" + theme.strings.total + "</label>";
          html +=
            "<span>" +
            Shopify.formatMoney(cart.total_price, theme.moneyFormat) +
            "</span>";
          html += "</div>";
          html +=
            '<div class="cart_extend--label row spacing-0 d-md-none mb-15">';
          if (theme.cart_note == true) {
            html += '<div class="extend--label__item col" data-label="note">';
            html +=
              '<svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.90371 16.5062V14.553L15.8459 8.61073L17.7992 10.564L11.8569 16.5062H9.90371ZM0 10.729V9.0784H8.2531V10.729H0ZM18.9821 9.38102L17.0289 7.42779L17.8267 6.62999C17.9734 6.48326 18.166 6.4099 18.4044 6.4099C18.6428 6.4099 18.8354 6.48326 18.9821 6.62999L19.7799 7.42779C19.9266 7.57451 20 7.76708 20 8.0055C20 8.24392 19.9266 8.4365 19.7799 8.58322L18.9821 9.38102ZM0 6.18982V4.5392H12.9298V6.18982H0ZM0 1.65062V0H12.9298V1.65062H0Z" fill="black"/></svg>';
            html += '<i class="zmdi zmdi-close"></i>';
            html += "</div>";
          }
          if (theme.cart_shipping_calculator == true) {
            html +=
              '<div class="extend--label__item col" data-label="estimate-shipping">';
            html +=
              '<svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.18182 14.5227C3.43939 14.5227 2.80682 14.2614 2.28409 13.7386C1.76136 13.2159 1.5 12.5833 1.5 11.8409H0V1.36364C0 1 0.136364 0.681818 0.409091 0.409091C0.681818 0.136363 1 0 1.36364 0H14.5227V3.79545H16.9091L20 7.90909V11.8409H18.3864C18.3864 12.5833 18.125 13.2159 17.6023 13.7386C17.0795 14.2614 16.447 14.5227 15.7045 14.5227C14.9621 14.5227 14.3295 14.2614 13.8068 13.7386C13.2841 13.2159 13.0227 12.5833 13.0227 11.8409H6.86364C6.86364 12.5833 6.60227 13.2159 6.07955 13.7386C5.55682 14.2614 4.92424 14.5227 4.18182 14.5227ZM4.18182 13.1591C4.54545 13.1591 4.85606 13.0303 5.11364 12.7727C5.37121 12.5152 5.5 12.2045 5.5 11.8409C5.5 11.4773 5.37121 11.1667 5.11364 10.9091C4.85606 10.6515 4.54545 10.5227 4.18182 10.5227C3.81818 10.5227 3.50758 10.6515 3.25 10.9091C2.99242 11.1667 2.86364 11.4773 2.86364 11.8409C2.86364 12.2045 2.99242 12.5152 3.25 12.7727C3.50758 13.0303 3.81818 13.1591 4.18182 13.1591ZM1.36364 10.4773H1.86364C2.12121 10.0682 2.44697 9.74242 2.84091 9.5C3.23485 9.25758 3.67424 9.13636 4.15909 9.13636C4.64394 9.13636 5.08712 9.26136 5.48864 9.51136C5.89015 9.76136 6.2197 10.0833 6.47727 10.4773H13.1591V1.36364H1.36364V10.4773ZM15.7045 13.1591C16.0682 13.1591 16.3788 13.0303 16.6364 12.7727C16.8939 12.5152 17.0227 12.2045 17.0227 11.8409C17.0227 11.4773 16.8939 11.1667 16.6364 10.9091C16.3788 10.6515 16.0682 10.5227 15.7045 10.5227C15.3409 10.5227 15.0303 10.6515 14.7727 10.9091C14.5152 11.1667 14.3864 11.4773 14.3864 11.8409C14.3864 12.2045 14.5152 12.5152 14.7727 12.7727C15.0303 13.0303 15.3409 13.1591 15.7045 13.1591ZM14.5227 8.52273H18.75L16.2273 5.15909H14.5227V8.52273Z" fill="black"/></svg>';
            html += '<i class="zmdi zmdi-close"></i>';
            html += "</div>";
          }
          if (theme.cart_discount_code == true) {
            html +=
              '<div class="extend--label__item col" data-label="discount">';
            html +=
              '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.95268 13.905L13.0909 10.755C13.2553 10.59 13.3748 10.4062 13.4496 10.2037C13.5243 10.0012 13.5616 9.7875 13.5616 9.5625C13.5616 9.0825 13.3935 8.67375 13.0573 8.33625C12.721 7.99875 12.3138 7.83 11.8356 7.83C11.5367 7.83 11.2379 7.9275 10.939 8.1225C10.6401 8.3175 10.3113 8.6325 9.95268 9.0675C9.59402 8.6325 9.26525 8.3175 8.96638 8.1225C8.6675 7.9275 8.36862 7.83 8.06974 7.83C7.59153 7.83 7.18431 7.99875 6.84807 8.33625C6.51183 8.67375 6.34371 9.0825 6.34371 9.5625C6.34371 9.7875 6.38107 10.0012 6.45579 10.2037C6.53051 10.4062 6.65006 10.59 6.81445 10.755L9.95268 13.905ZM9.77335 18C9.59402 18 9.42217 17.97 9.25778 17.91C9.0934 17.85 8.93649 17.7525 8.78705 17.6175L0.381071 9.18C0.246575 9.03 0.14944 8.8725 0.0896637 8.7075C0.0298878 8.5425 0 8.37 0 8.19V1.35C0 0.96 0.127024 0.6375 0.381071 0.3825C0.635118 0.1275 0.956413 0 1.34496 0H8.1594C8.33873 0 8.51806 0.0262501 8.69738 0.0787501C8.87671 0.13125 9.0411 0.2325 9.19053 0.3825L17.5517 8.775C17.8506 9.075 18 9.40875 18 9.77625C18 10.1437 17.8506 10.4775 17.5517 10.7775L10.7372 17.6175C10.6177 17.7375 10.472 17.8313 10.3001 17.8988C10.1283 17.9663 9.95268 18 9.77335 18ZM9.77335 16.65L16.5878 9.81L8.1594 1.35H1.34496V8.19L9.77335 16.65ZM3.69863 4.86C4.01245 4.86 4.28518 4.74375 4.51681 4.51125C4.74844 4.27875 4.86426 4.005 4.86426 3.69C4.86426 3.375 4.74844 3.10125 4.51681 2.86875C4.28518 2.63625 4.01245 2.52 3.69863 2.52C3.38481 2.52 3.11208 2.63625 2.88045 2.86875C2.64882 3.10125 2.533 3.375 2.533 3.69C2.533 4.005 2.64882 4.27875 2.88045 4.51125C3.11208 4.74375 3.38481 4.86 3.69863 4.86V4.86Z" fill=""/></svg>';
            html += '<i class="zmdi zmdi-close"></i>';
            html += "</div>";
          }
          html += "</div>";
          var price = cart.total_price;
          var freeshipping_value = theme.freeshipping_value;
          if (theme.show_free_shipping == true) {
            if (parseFloat(price / 100) < parseFloat(freeshipping_value)) {
              var price_remain = (
                parseFloat(freeshipping_value) - parseFloat(price / 100)
              ).toFixed(0);

              html += '<div id="threshold_bar_popup_minicart">';
              html += '<div class="cart_threshold">';
              html +=
                '<div class="threshold_spend">' +
                theme.strings.spend +
                " " +
                Shopify.formatMoney(price_remain * 100, theme.moneyFormat) +
                " " +
                theme.strings.spend__html +
                "</div>";
              html += '<div class="threshold_bar">';
              html +=
                '<span class="animate" style="width:' +
                (price / freeshipping_value).toFixed(0) +
                '%!important">';
              html +=
                "<span>" + (price / freeshipping_value).toFixed(0) + "%</span>";
              html += "</span>";
              html += "</div>";
              html += "</div>";
              html += "</div>";
            } else {
              html += '<div id="threshold_bar_popup_minicart">';
              html +=
                '<div class="threshold_spend spend_congrats"><span>' +
                theme.strings.content_threshold +
                '<i class="rbb-icon-delivery-11"></i></span></div>';
              html +=
                '<div class="threshold_bar threshold_congrats"><span class="animate" style="width: 100% !important;"><span>100%</span></div>';
              html += "</div>";
            }
          }
          html += '<div class="btn_submit">';
          if (theme.terms_conditions_enable == true) {
            html +=
              '<input type="checkbox" name="checkout__input" value="1" id="checkout__canvas" class="hide">';
          }
          html +=
            '<a href="/cart" class="btn btn-success"><span>' +
            theme.strings.view_cart +
            "</span></a>";
          html +=
            '<button type="submit" class="btn cart__checkout" name="checkout"><span>' +
            theme.strings.check_out +
            "</span></button>";
          if (theme.terms_conditions_enable == true) {
            html +=
              '<label for="checkout__canvas" class="d-flex align-items-center mt-20">';
            html +=
              '<span class="custom-checkbox pointer d-inline-flex align-items-center justify-content-center"><i class="zmdi zmdi-check"></i></span>';
            html +=
              '<span class="label__text">' +
              theme.proceed_to_checkout +
              "</span>";
            html += "</label>";
          }
          html += "</div>";
          html += "</div>";
          html += "</form>";
          $("#cart-info").append(html);
          $("#cart_total").html(
            Shopify.formatMoney(cart.total_price, theme.moneyFormat)
          );
          Currency.convertAll(
            shopCurrency,
            $("#currencies span.selected").attr("data-currency")
          );
          var i = $(".ajaxcart__inner").outerHeight();
          var f = $(".ajaxcart__footer").outerHeight();
          var c = $(".ajaxcart").height() - 30;
          if (i + f >= c) {
            $(".ajaxcart__footer").addClass("h_scroll");
          }
          if (!$(".form-cart__extent").length) {
            nuranium.initCartExtend();
          }
        } else {
          var link_collection = $(".link_to_collection_cart_empty").html();
          var html = "";
          html += '<div class="cart cart_empty">';
          html +=
            '<div class="empty_title text-center">' +
            theme.strings.cart_empty +
            "</div>";
          html += '<div class="text-center mt-40 block_link_cart">';
          html += "" + link_collection + "";
          html += "</div>";
          html += "</div>";
          $("#cart-info").append(html);
          $("#cart_total").html("$0");
          $("#desktop_cart").removeClass("item_count");
          $(".form-cart__extent").remove();
        }
      });
    },

    ajaxProductAddToCart: function () {
      $(document).on("click", ".product-form__cart-submit", function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.css("pointer-events", "none").addClass("loading");
        $(".lookbook-modal").modal("hide");
        $.ajax({
          type: "POST",
          url: "/cart/add.js",
          data: $this.parents("form").serialize(),
          dataType: "json",
          success: function (cart) {
            $.get("/cart?view=json", function (data) {
              $("#cart-info").html(data);
            }).always(function () {
              Currency.convertAll(
                shopCurrency,
                $("#currencies span.selected").attr("data-currency")
              );
              if (theme.cart_status == "show_popup") {
                nuranium.initAddToCart(cart.image, cart.title);
              }
              if (!$(".form-cart__extent").length) {
                nuranium.initCartExtend();
              }
              nuranium.updateMiniCart();

              nuranium.PopupAddToCart();

              $this.css("pointer-events", "auto").removeClass("loading");
              $(".cart_extend").removeClass("act");
              $(".cart_extend--label").removeClass("act");
            });
          },
          complete: function () {
            $("body").removeClass("cart_popup_opened");
            $("body").removeClass("loading");
            $(".nov-close, .cart_popup_opened .nov-ready").on(
              "click",
              function () {
                if ($("body").hasClass("template-cart")) {
                  window.location.reload();
                }
              }
            );
            if (theme.cart_status == "show_minicart") {
              setTimeout(function () {
                $("#desktop_cart").addClass("active");
                $(".sidebar-overlay").addClass("act");
              }, 1000);
            }
            $(document).find(".zmdi-close").trigger("click");
          },
          error: function (XMLHttpRequest, textStatus) {
            $this
              .removeClass("loading")
              .css("pointer-events", "auto")
              .find(".add-to-cart-text")
              .text(window.inventory_text.sold_out);
          },
        }).done(function () {
          $("body").removeClass("loading");
        });
      });
    },
    initQuickView: function () {
      $(document).on("click", ".btnProductQuickview", function (e) {
        e.preventDefault();
        $(".lookbook-modal").modal("hide");
        var $this = $(this);
        $.ajax({
          beforeSend: function () {
            $("body").addClass("open_gl_quick_view");
          },
          url: $this.attr("data-url"),
          success: function (data) {
            $.magnificPopup.open({
              items: {
                src:
                  '<div class="nov-with-anim popup-quick-view" id="content_quickview">' +
                  data +
                  "</div>", // can be a HTML string, jQuery object, or CSS selector
                type: "inline",
              },
              removalDelay: 500,
              closeMarkup: '<i class="zmdi zmdi-hc-fw zmdi-close"></i>',
              callbacks: {
                beforeOpen: function () {
                  this.st.mainClass = "nov-move-horizontal";
                },
                open: function () {
                  if($("html").hasClass("lang-rtl")) rtl = true;
                  else rtl = false;
                  $(".quickview_slick").slick({
                    nextArrow:
                      '<div class="arrow-next"><i class="zmdi zmdi-chevron-right"></i></div>',
                    prevArrow:
                      '<div class="arrow-prev"><i class="zmdi zmdi-chevron-left"></i></div>',
                    rtl: rtl,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    dots: false,
                    infinite: true,
                    adaptiveHeight: !0,
                  });
                  $("variant-radios label").click(function () {
                    setTimeout(function () {
                      var dindex = $(".quickview_slick")
                        .find(".item.act")
                        .attr("data-slick-index");
                      $(".quickview_slick").slick("slickGoTo", dindex);
                    }, 300);
                  });
                  Shopify.PaymentButton.init();

                  Currency.convertAll(
                    shopCurrency,
                    $("#currencies span.selected").attr("data-currency")
                  );

                  setTimeout(function () {
                    if (
                      $(".shopify-product-reviews-badge").length &&
                      $(".spr-badge").length
                    ) {
                      return (
                        window.SPR.registerCallbacks(),
                        window.SPR.initRatingHandler(),
                        window.SPR.initDomEls(),
                        window.SPR.loadProducts(),
                        window.SPR.loadBadges()
                      );
                    }
                  }, 1000);
                  nuranium.initNovWishListIcons();
                  jQuery("variant-radios :radio").change(function () {
                    var optionIndex = jQuery(this)
                      .closest(".swatch")
                      .attr("data-option-index");
                    var optionValue = jQuery(this).val();
                    jQuery(this)
                      .parents("fieldset")
                      .find(".variant_current")
                      .text(optionValue);
                  });
                  $(document).on(
                    "click",
                    "#content_quickview .soldout",
                    function () {
                      $("#content_quickview .zmdi-close").trigger("click");
                    }
                  );
                },
                close: function () {
                  $("#content_quickview").empty();
                  $("body").removeClass("open_gl_quick_view");
                  $("body").removeClass("cart_popup_opened");
                  $("body").removeClass("open_quick_variants");
                  $("body").find(".tooltip").remove();
                },
              },
            });
          },
          complete: function () {
            Shopify.PaymentButton.init();
          },
        }).done(function () {
          $this.removeClass("btn-loading");
          $("body").removeClass("loading");
          $("body").find(".tooltip").remove();
        });
        const product_url = this.getAttribute("data-product-url");
        fetch(product_url)
          .then((response) => response.text())
          .then((responseText) => {
            const responseHTML = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            const sectionId = responseHTML
              .querySelector(".product-template__container")
              .getAttribute("data-section-id");
            const content_quickview =
              document.getElementById("content_quickview");

            content_quickview
              .querySelector("variant-radios")
              .setAttribute("data-section", sectionId);
            content_quickview
              .querySelector(".product-template__container")
              .setAttribute("data-section-id", sectionId);
            content_quickview.querySelector(".product-template__container").id =
              "ProductSection-" + sectionId;
            content_quickview.querySelector("#ProductPrice-templateQV").id =
              "ProductPrice-" + sectionId;
            if (content_quickview.querySelector("#ComparePrice-templateQV")) {
              content_quickview.querySelector("#ComparePrice-templateQV").id =
                "ComparePrice-" + sectionId;
            }
            content_quickview.querySelector("form").id =
              "product-form-" + sectionId;
            content_quickview
              .querySelector("form")
              .setAttribute("data-section", sectionId);
            item = content_quickview.querySelectorAll(".item_img");
            for (var i = 0; i < item.length; i++) {
              mediaId = item[i].getAttribute("data-media-id");
              item[i].setAttribute("data-media-id", sectionId + mediaId);
            }
            input = content_quickview.querySelectorAll("input[type=radio]");
            for (var i = 0; i < input.length; i++) {
              input[i].setAttribute("form", sectionId);
            }
          });
      });
    },
    ajaxRemoveFromCart: function () {
      $("#cart-info").on("click", ".remove-from-cart", function (e) {
        e.preventDefault();

        var $this = $(this),
          $id = $this.attr("data-product-id");

        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: "quantity=0&id=" + $id,
          dataType: "json",
          success: function (cart) {
            if ($("body").hasClass("template-cart")) {
              window.location.reload();
            } else {
              nuranium.initMiniCart();
            }
          },
        });
      });
    },
    changeQuantityMiniCart: function () {
      function MiniCartUpdate(_id, new_qty) {
        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: "quantity=" + new_qty + "&id=" + _id,
          dataType: "json",
          success: function (cart) {
            jQuery
              .get("/cart?view=up_ajax", function (data) {
                data = jQuery(data);
                var sdata = jQuery(data);
                var t_html = jQuery(sdata.get(0)).html(),
                  t_threshold = jQuery(sdata.get(2)).html();
                t_total = $("#cart-info").find(".subtotal");
                $("#cart-info").find(".subtotal span").html(t_html);
                $("#threshold_bar_popup_minicart .cart_threshold").html(
                  t_threshold
                );
              })
              .always(function () {
                Currency.convertAll(
                  shopCurrency,
                  $("#currencies span.selected").attr("data-currency")
                );
              });

            $.get("/cart?view=json", function (data) {
              $("#cart-info").html(data);
            }).always(function () {
              Currency.convertAll(
                shopCurrency,
                $("#currencies span.selected").attr("data-currency")
              );
              nuranium.updateMiniCart();
            });
          },
        });
      }
      $(document).on("click", ".cart__mini-qty", function (e) {
        e.preventDefault();
        var $this = $(this),
          $qty = $this.siblings(".cart__mini-qty--input"),
          $id = $qty.attr("data-id"),
          $qtyinput = parseFloat($qty.val()),
          $step = parseFloat($qty.attr("step")),
          $min = parseFloat($qty.attr("min")),
          $max = parseFloat($qty.attr("max"));
        if ($this.hasClass("cart__mini-qty--plus")) {
          var $newqty = $qtyinput + $step;
          if ($newqty > $max && $max > 0) {
            $qty.val($max);
            return;
          } else {
            $qty.val($newqty);
          }
        } else if ($this.hasClass("cart__mini-qty--minus")) {
          var $newqty = $qtyinput - $step;
          if ($newqty === 0) {
            var last_qty = parseInt($qty.attr("value"));
            $qty.val(last_qty);
            $this
              .parents(".ajaxcart__product")
              .find(".remove-from-cart")
              .trigger("click");
            return;
          } else if ($newqty < $min) {
            return;
          } else if ($qtyinput < 0) {
            alert("Invalid");
            return;
          } else {
            $qty.val($newqty);
          }
        }

        MiniCartUpdate($id, $newqty);
      });
      $(document).on("change", ".cart__mini-qty--input", function (e) {
        var $this = $(this),
          $newqty = parseFloat($this.val()),
          $id = $this.attr("data-id"),
          $min = parseFloat($this.attr("min")),
          $max = parseFloat($this.attr("max"));
        if ($newqty > $max && $max > 0) {
          $newqty.val($max);
          return;
        }
        if ($newqty === 0) {
          $this
            .parents(".ajaxcart__product")
            .find(".remove-from-cart")
            .trigger("click");
          return;
        }
        MiniCartUpdate($id, $newqty);
      });
    },
    changeQuantityPageCart: function () {
      function ShopifyCartChange(variant_id, quantity, callback) {
        var params = {
          type: "POST",
          url: "/cart/change.js",
          data: "quantity=" + quantity + "&line=" + variant_id,
          dataType: "json",
          success: function (cart) {
            if (typeof callback === "function") {
              callback(cart);
            }
          },
          error: function (XMLHttpRequest, textStatus) {},
        };
        jQuery.ajax(params);
      }

      $(document).on(
        "change keyup",
        ".cart__qty-input, .cart__popup-qty--input",
        function () {
          var $this = $(this);
          var line = $this.data("line"),
            val = parseInt($this.val()),
            price = $this.data("price"),
            max = $this.attr("max");
          if (isNaN(val)) return 0;

          max = isNaN(parseInt(max)) ? 9999 : parseInt(max);
          if (val > max) {
            $this.attr("value", max).val(max);
          }
          val = val > max ? max : val;
          if (val <= 0) {
            $this.closest("tr").remove();
          }

          ShopifyCartChange(line, val, function (res) {
            $(".cart__subtotal").html(
              Shopify.formatMoney(res.total_price, theme.moneyFormat)
            );

            $this
              .parents(".cart_item")
              .find(".product-subtotal")
              .html(Shopify.formatMoney(price * val, theme.moneyFormat));

            $("#CartCount, #CartCountCavas").html(res.item_count);

            $(".cart__heading span").html(
              "There are " + res.item_count + " items in your cart"
            );

            Currency.convertAll(
              shopCurrency,
              $("#currencies span.selected").attr("data-currency")
            );

            jQuery.get("/cart?view=ship", function (data) {
              $("#threshold_bar_popup").html(data);
              setTimeout(function () {
                Currency.convertAll(
                  shopCurrency,
                  $("#currencies span.selected").attr("data-currency")
                );
              }, 200);
            });
            $.get("/cart?view=json", function (data) {
              $("#cart-info").html(data);
            }).always(function () {
              Currency.convertAll(
                shopCurrency,
                $("#currencies span.selected").attr("data-currency")
              );
              nuranium.updateMiniCart();
            });
          });
        }
      );

      $(document).on("click", ".plus, .minus", function () {
        var $qty = $(this).closest(".cart__qty").find(".cart__qty-input"),
          currentVal = parseFloat($qty.val()),
          max = parseFloat($qty.attr("max")),
          min = parseFloat($qty.attr("min")),
          step = $qty.attr("step");

        if (!currentVal || currentVal === "" || currentVal === "NaN")
          currentVal = 0;
        if (max === "" || max === "NaN") max = "";
        if (min === "" || min === "NaN") min = 0;
        if (
          step === "any" ||
          step === "" ||
          step === undefined ||
          parseFloat(step) === "NaN"
        )
          step = 1;

        if ($(this).is(".plus")) {
          if (max && currentVal >= max) {
            $qty.val(max);
          } else {
            $qty.val(currentVal + parseFloat(step));
          }
        } else {
          if (min && currentVal <= min) {
            $qty.val(min);
          } else if (currentVal > 0) {
            $qty.val(currentVal - parseFloat(step));
          }
        }
        $qty.trigger("change");
      });

      $(document).on(
        "click",
        ".quick_view-qty-plus, .quick_view-qty-minus",
        function () {
          var $qty = $(this)
              .closest(".quick_view_qty")
              .find('input[name="quantity"]'),
            currentVal = parseFloat($qty.val()),
            max = parseFloat($qty.attr("max")),
            min = parseFloat($qty.attr("min")),
            step = $qty.attr("step");

          if (!currentVal || currentVal === "" || currentVal === "NaN")
            currentVal = 0;
          if (max === "" || max === "NaN") max = "";
          if (min === "" || min === "NaN") min = 0;
          if (
            step === "any" ||
            step === "" ||
            step === undefined ||
            parseFloat(step) === "NaN"
          )
            step = 1;

          if ($(this).is(".quick_view-qty-plus")) {
            if (max && currentVal >= max) {
              $qty.val(max);
            } else {
              $qty.val(currentVal + parseFloat(step));
            }
          } else {
            if (min && currentVal <= min) {
              $qty.val(min);
            } else if (currentVal > 0) {
              $qty.val(currentVal - parseFloat(step));
            }
          }
        }
      );
    },
    initCartExtend: function () {
      jQuery.get("/cart?view=extend", function (data) {
        $(".block_cart_top").before(data);
        if ($("html").hasClass("lang-rtl")) {
          $(".extend--label__item").attr("data-placement", "right");
        } else {
          $(".extend--label__item").attr("data-placement", "left");
        }
      });
      setTimeout(function () {
        if ($("#shipping-calculator").length > 0) {
          "object" == typeof Countries &&
            (Countries.updateProvinceLabel = function (e, t) {
              if (
                "string" == typeof e &&
                Countries[e] &&
                Countries[e].provinces
              ) {
                if (
                  "object" != typeof t &&
                  ((t = document.getElementById("address_province_label")),
                  null === t)
                )
                  return;
                t.innerHTML = Countries[e].label;
                var r = jQuery(t).parent();
                r.find("select");
                r.find(".custom-style-select-box-inner").html(
                  Countries[e].provinces[0]
                );
              }
            }),
            "undefined" == typeof Shopify.Cart && (Shopify.Cart = {}),
            (Shopify.Cart.ShippingCalculator = (function () {
              var _config = {
                  submitButton: "Calculate shipping",
                  submitButtonDisabled: "Calculating...",
                  templateId: "shipping-calculator-response-template",
                  wrapperId: "wrapper-response",
                  customerIsLoggedIn: !1,
                  moneyFormat: "${{amount}}",
                },
                _render = function (e) {
                  var t = jQuery("#" + _config.templateId),
                    r = jQuery("#" + _config.wrapperId);
                  if (t.length && r.length) {
                    var templateSettings = {
                      evaluate: /<%([\s\S]+?)%>/g,
                      interpolate: /<%=([\s\S]+?)%>/g,
                      escape: /<%-([\s\S]+?)%>/g,
                    };
                    var n = Handlebars.compile(jQuery.trim(t.text())),
                      a = n(e);
                    if (
                      (jQuery(a).appendTo(r),
                      "undefined" != typeof Currency &&
                        "function" == typeof Currency.convertAll)
                    ) {
                      var i = "";
                      jQuery("[name=currencies]").length > 0
                        ? (i = jQuery("[name=currencies]").val())
                        : jQuery("#currencies span.selected").length > 0 &&
                          (i = jQuery("#currencies span.selected").attr(
                            "data-currency"
                          )),
                        "" !== i &&
                          Currency.convertAll(
                            shopCurrency,
                            i,
                            "#wrapper-response span.money, #estimated-shipping span.money"
                          );
                    }
                  }
                },
                _enableButtons = function () {
                  jQuery(".get-rates")
                    .removeAttr("disabled")
                    .removeClass("disabled")
                    .val(_config.submitButton);
                },
                _disableButtons = function () {
                  jQuery(".get-rates")
                    .val(_config.submitButtonDisabled)
                    .attr("disabled", "disabled")
                    .addClass("disabled");
                },
                _getCartShippingRatesForDestination = function (e) {
                  var t = {
                    type: "POST",
                    url: "/cart/prepare_shipping_rates",
                    data: jQuery.param({ shipping_address: e }),
                    success: _pollForCartShippingRatesForDestination(e),
                    error: _onError,
                  };
                  jQuery.ajax(t);
                },
                _pollForCartShippingRatesForDestination = function (e) {
                  var t = function () {
                    jQuery.ajax("/cart/async_shipping_rates", {
                      dataType: "json",
                      success: function (r, n, a) {
                        200 === a.status
                          ? _onCartShippingRatesUpdate(r.shipping_rates, e)
                          : setTimeout(t, 500);
                      },
                      error: _onError,
                    });
                  };
                  return t;
                },
                _fullMessagesFromErrors = function (e) {
                  var t = [];
                  return (
                    jQuery.each(e, function (e, r) {
                      jQuery.each(r, function (r, n) {
                        t.push(e + " " + n);
                      });
                    }),
                    t
                  );
                },
                _onError = function (XMLHttpRequest, textStatus) {
                  jQuery("#estimated-shipping").hide(),
                    jQuery("#estimated-shipping em").empty(),
                    _enableButtons();
                  var feedback = "",
                    data = eval("(" + XMLHttpRequest.responseText + ")");
                  (feedback = data.message
                    ? data.message +
                      "(" +
                      data.status +
                      "): " +
                      data.description
                    : "Error : " +
                      _fullMessagesFromErrors(data).join("; ") +
                      "."),
                    "Error : country is not supported." === feedback &&
                      (feedback = "We do not ship to this destination."),
                    _render({
                      rates: [],
                      errorFeedback: feedback,
                      success: !1,
                    }),
                    jQuery("#" + _config.wrapperId).show();
                },
                _onCartShippingRatesUpdate = function (e, t) {
                  _enableButtons();
                  var r = "";
                  if (
                    (t.zip && (r += t.zip + ", "),
                    t.province && (r += t.province + ", "),
                    (r += t.country),
                    e.length)
                  ) {
                    "0.00" == e[0].price
                      ? jQuery("#estimated-shipping em").html("FREE")
                      : jQuery("#estimated-shipping em").html(
                          _formatRate(e[0].price)
                        );
                    for (var n = 0; n < e.length; n++)
                      e[n].price = _formatRate(e[n].price);
                  }
                  _render({ rates: e, address: r, success: !0 }),
                    jQuery(
                      "#" + _config.wrapperId + ", #estimated-shipping"
                    ).fadeIn();
                },
                _formatRate = function (e) {
                  function t(e, t) {
                    return "undefined" == typeof e ? t : e;
                  }
                  function r(e, r, n, a) {
                    if (
                      ((r = t(r, 2)),
                      (n = t(n, ",")),
                      (a = t(a, ".")),
                      isNaN(e) || null == e)
                    )
                      return 0;
                    e = (e / 100).toFixed(r);
                    var i = e.split("."),
                      o = i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + n),
                      s = i[1] ? a + i[1] : "";
                    return o + s;
                  }
                  if ("function" == typeof Shopify.formatMoney)
                    return Shopify.formatMoney(e, _config.moneyFormat);
                  "string" == typeof e && (e = e.replace(".", ""));
                  var n = "",
                    a = /\{\{\s*(\w+)\s*\}\}/,
                    i = _config.moneyFormat;
                  switch (i.match(a)[1]) {
                    case "amount":
                      n = r(e, 2);
                      break;
                    case "amount_no_decimals":
                      n = r(e, 0);
                      break;
                    case "amount_with_comma_separator":
                      n = r(e, 2, ".", ",");
                      break;
                    case "amount_no_decimals_with_comma_separator":
                      n = r(e, 0, ".", ",");
                  }
                  return i.replace(a, n);
                };
              return (
                (_init = function () {
                  new Shopify.CountryProvinceSelector(
                    "address_country",
                    "address_province",
                    { hideElement: "address_province_container" }
                  );
                  var e = jQuery("#address_country"),
                    t = jQuery("#address_province_label").get(0);
                  "undefined" != typeof Countries &&
                    (Countries.updateProvinceLabel(e.val(), t),
                    e.change(function () {
                      Countries.updateProvinceLabel(e.val(), t);
                    })),
                    jQuery(".get-rates").click(function () {
                      _disableButtons(),
                        jQuery("#" + _config.wrapperId)
                          .empty()
                          .hide();
                      var e = {};
                      (e.zip = jQuery("#address_zip").val() || ""),
                        (e.country = jQuery("#address_country").val() || ""),
                        (e.province = jQuery("#address_province").val() || ""),
                        _getCartShippingRatesForDestination(e);
                    }),
                    _config.customerIsLoggedIn &&
                      jQuery(".get-rates:eq(0)").trigger("click");
                }),
                {
                  show: function (e) {
                    (e = e || {}),
                      jQuery.extend(_config, e),
                      jQuery(function () {
                        _init();
                      });
                  },
                  getConfig: function () {
                    return _config;
                  },
                  formatRate: function (e) {
                    return _formatRate(e);
                  },
                }
              );
            })());
          Shopify.Cart.ShippingCalculator.show({
            submitButton: theme.strings.shippingCalcSubmitButton,
            submitButtonDisabled:
              theme.strings.shippingCalcSubmitButtonDisabled,
            customerIsLoggedIn: theme.strings.shippingCalcCustomerIsLoggedIn,
            moneyFormat: theme.strings.shippingCalcMoneyFormat,
          });
        }
      }, 1000);
    },
  };
})(jQuery);
