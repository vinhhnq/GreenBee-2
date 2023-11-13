!(function ($) {
  var body = $("body"),
      wishListsArr = localStorage.getItem("wishListsArr")
          ? JSON.parse(localStorage.getItem("wishListsArr"))
          : [];
  localStorage.setItem("wishListsArr", JSON.stringify(wishListsArr)),
      wishListsArr.length &&
          (wishListsArr = JSON.parse(localStorage.getItem("wishListsArr"))),
      $(document).ready(function () {
          $(document).ajaxStart(function () {
              nuranium.isAjaxLoading = !0;
          }),
              $(document).ajaxStop(function () {
                  nuranium.isAjaxLoading = !1;
              }),
              nuranium.init(),
              $("#popup-subscribe i.zmdi-close").on("click", function () {
                  $(this).parents("#popup-subscribe").modal("hide");
              });
          var t = {
              purchase_code: vinovathemes.main_info.lic,
              shopify_domain: vinovathemes.main_info.domain,
          };
          nuranium.validLicense(t);
      });
  var nuranium = {
      validLicense: function (t) {
          $.ajax({
              url: "https://vinovathemes.com/license/check_license.php",
              type: "post",
              data: t,
              success: function (t) {
                  var a = JSON.parse(t);
                  if (
                      ($("#Nov_purchasecode").on("contextmenu", function (t) {
                          t.preventDefault();
                      }),
                      !1 == a.status)
                  )
                      return (
                          $("#Nov_purchasecode").removeClass("hide hidden"),
                          $("#Nov_purchasecode-waring").html(a.msg),
                          !1
                      );
                  a.status &&
                      ($("#Nov_purchasecode-waring")
                          .html(a.msg)
                          .slideDown(250),
                      setTimeout(function () {
                          $("#Nov_purchasecode").remove();
                      }, 1e3));
              },
          });
      },
      isAjaxLoading: !1,
      init: function () {
          this.closeModal(),
              this.novProductTabs(),
              this.initNovWishListIcons(),
              this.doAddOrRemoveWishlist(),
              $("body").hasClass("template-page") &&
                  $(".wishlist-page").length &&
                  this.initNovWishListsPage(),
              this.ajaxProductAddToCart(),
              this.ajaxAddToCart(),
              this.ajaxChangeFromCart(),
              this.initMiniCart(),
              this.ajaxRemoveFromCart(),
              this.changeQuantityPageCart(),
              this.initCollapseSidebarBlock(),
              this.changeQuantityMiniCart(),
              this.initproductItemColorSwatch(),
              this.productItemSwatch(),
              this.togglePopupAddToCart(),
              body.hasClass("template-collection") &&
                  this.initCollectionPageLoadmore(),
              $(window).width() > 767 && this.initQuickView();
      },
      initCollectionPageLoadmore: function () {
          var t = $(".scroll__infitiny"),
              a = ".scroll__infitiny a";
          t.length &&
              (body
                  .off("click.initCollectionPageLoadmore", a)
                  .on("click.initCollectionPageLoadmore", a, function (t) {
                      if (
                          (t.preventDefault(),
                          t.stopPropagation(),
                          !$(this).hasClass("disabled"))
                      ) {
                          var a = $(this).data("href");
                          nuranium.ajaxCollectionPageLoadmoreGetContent(a),
                              Currency.convertAll(
                                  shopCurrency,
                                  $("#currencies span.selected").attr(
                                      "data-currency"
                                  )
                              );
                      }
                  }),
              $(window).scroll(function () {
                  if (!nuranium.isAjaxLoading) {
                      var t,
                          i,
                          e = $(".collection-filter__content"),
                          n =
                              e.offset().top +
                              e.outerHeight() -
                              $(window).height();
                      if (
                          $(this).scrollTop() > n &&
                          $(this).scrollTop() < n + 200
                      ) {
                          var o = $(a);
                          if (o.length && !o.hasClass("disabled")) {
                              var s = o.data("href");
                              nuranium.ajaxCollectionPageLoadmoreGetContent(
                                  s
                              ),
                                  Currency.convertAll(
                                      shopCurrency,
                                      $("#currencies span.selected").attr(
                                          "data-currency"
                                      )
                                  );
                          }
                      }
                  }
              }));
      },
      ajaxCollectionPageLoadmoreGetContent: function (t) {
          nuranium.isAjaxLoading ||
              $.ajax({
                  type: "GET",
                  url: t,
                  beforeSend: function () {
                      $(".scroll__infitiny")
                          .removeClass("loading")
                          .addClass("loading");
                  },
                  success: function (t) {
                      nuranium.ajaxCollectionPageLoadmoreMapData(t),
                          jdgm.customizeBadges();
                  },
                  complete: function () {
                      $(".scroll__infitiny").removeClass("loading");
                  },
              });
      },
      ajaxCollectionPageLoadmoreMapData: function (t) {
          var a = $(".collection-template"),
              i = a.find(".product-collection"),
              e = a.find(".paging"),
              n = $(t).find(".collection-template");
          if (
              ((newProductCollection = n.find(".product-collection")),
              (newProductCount = n.find(".paging")),
              (newProductItem = newProductCollection.children(
                  ".product--item"
              )),
              e.replaceWith(newProductCount),
              newProductCollection.length)
          ) {
              i.append(newProductItem);
              var o = a.find(".product--item").length,
                  s = $(".pagination__bar").data("max");
              $(".pagination__count .count").text(o),
                  $(".pagination__bar .progress").css(
                      "width",
                      (o / s) * 100 + "%"
                  );
          }
      },
      togglePopupAddToCart: function () {
          $(".selector-wrapper-1").each(function () {
              $(this).hasClass("opt-color.hide") &&
                  $(this)
                      .closest(".item-product__popup--variant")
                      .find(".btn-close-quick-add")
                      .hide();
          }),
              $(document).on("click", ".btn-quick-add", function () {
                  $(".item-product__popup--variant").removeClass("act"),
                      $(".item-product .thumbnail-container").removeClass(
                          "popup-act"
                      ),
                      $(this)
                          .parent()
                          .find(".item-product__popup--variant")
                          .addClass("act"),
                      $(this)
                          .parents(".thumbnail-container")
                          .addClass("popup-act"),
                      !0 ==
                          $(this)
                              .parents(".nov-slick-carousel")
                              .data("nav") &&
                          $(this)
                              .parents(".nov-slick-carousel")
                              .find(".slick-arrow")
                              .css("visibility", "hidden"),
                      !0 ==
                          $(this)
                              .parents(".collection-carousel")
                              .data("nav") &&
                          $(this)
                              .parents(".collection-carousel")
                              .find(".slick-arrow")
                              .css("visibility", "hidden"),
                      $(this)
                          .parents(".item-product")
                          .find(".countdownfree")
                          .css("visibility", "hidden");
              }),
              $(document).on("click", ".btn-close-quick-add", function () {
                  $(this).parent().removeClass("act"),
                      $(this)
                          .parents(".thumbnail-container")
                          .removeClass("popup-act"),
                      !0 ==
                          $(this)
                              .parents(".nov-slick-carousel")
                              .data("nav") &&
                          $(this)
                              .parents(".nov-slick-carousel")
                              .find(".slick-arrow")
                              .css("visibility", "visible"),
                      !0 ==
                          $(this)
                              .parents(".collection-carousel")
                              .data("nav") &&
                          $(this)
                              .parents(".collection-carousel")
                              .find(".slick-arrow")
                              .css("visibility", "visible"),
                      $(this)
                          .parents(".item-product")
                          .find(".countdownfree")
                          .css("visibility", "visible");
              });
      },
      initCollapseSidebarBlock: function () {
          $(document).on("click", ".facets__label--title", (t) => {
              var a = $(t.currentTarget),
                  i = a.parents(".js-filter").find(".facets__content");
              a.parent().hasClass("act")
                  ? (a.parent().removeClass("act"),
                    a.parents(".js-filter").removeClass("act"),
                    i.slideUp())
                  : (a.parent().addClass("act"),
                    a.parents(".js-filter").addClass("act"),
                    i.slideDown());
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
          $("[data-product-tabs]").each(function () {
              var t = $(this),
                  a = t
                      .find(".list-product-tabs")
                      .find("[data-product-tabtop]"),
                  i = t.find("[data-product-TabContent]"),
                  e = t.find(".list-product-tabs .tab-links.active"),
                  n = t.find(".product-tabs-content .tab-content.active");
              nuranium.doAjaxNovProductTabs(
                  e.data("href"),
                  n.find(".products-grid"),
                  a
              ),
                  a.off("click").on("click", function (t) {
                      if (
                          (t.preventDefault(),
                          t.stopPropagation(),
                          !$(this).hasClass("active") &&
                              !$(this).hasClass("active"))
                      ) {
                          var e = $(this),
                              n = $(e.data("target"));
                          if (
                              (a.removeClass("active"),
                              i.removeClass("active"),
                              n
                                  .find(".collection-carousel")
                                  .hasClass("slick-initialized") ||
                                  nuranium.doAjaxNovProductTabs(
                                      e.data("href"),
                                      n.find(".products-grid"),
                                      a
                                  ),
                              e.addClass("active"),
                              n.addClass("active"),
                              n
                                  .find(".collection-carousel")
                                  .hasClass("slick-initialized"))
                          ) {
                              var o = $(n.find(".collection-carousel")),
                                  s = o.find(".slick-slide").length,
                                  r = o.find(".slick-active").length,
                                  d = o
                                      .find(".slick-active:first")
                                      .data("slick-index"),
                                  c =
                                      o
                                          .find(".slick-active:last")
                                          .data("slick-index") + 1,
                                  l = o
                                      .parents("[data-product-tabs]")
                                      .find(".nav-slider--prev"),
                                  p = o
                                      .parents("[data-product-tabs]")
                                      .find(".nav-slider--next"),
                                  u = o
                                      .find(".slick-current")
                                      .data("slick-index");
                              o
                                  .parents("[data-product-tabs]")
                                  .find(".total_nav")
                                  .text(Math.ceil(s / r)),
                                  (page = Math.ceil(
                                      ((u || 0) + 1) / length
                                  )) > Math.ceil(s / r) &&
                                      (page = Math.ceil(s / r)),
                                  o
                                      .parents("[data-product-tabs]")
                                      .find(".current_nav")
                                      .text(page),
                                  s == r
                                      ? (l.css("visibility", "hidden"),
                                        p.css("visibility", "hidden"))
                                      : (l.css("visibility", "visible"),
                                        p.css("visibility", "visible")),
                                  0 == d
                                      ? l.addClass("disabled")
                                      : l.removeClass("disabled"),
                                  s - c > 0
                                      ? p.removeClass("disabled")
                                      : p.addClass("disabled");
                          }
                      }
                  });
          });
      },
      doAjaxNovProductTabs: function (t, a, i) {
          $.ajax({
              type: "GET",
              url: window.router + t,
              beforeSend: function () {
                  i.css({ "pointer-events": "none", opacity: "0.6" });
              },
              success: function (e) {
                  if (
                      "/collections/?view=json" == t ||
                      "/collections/?view=new-json" == t
                  );
                  else {
                      a.html($(e).find(".grid-item").html());
                      var n = i.data("limit") - 1;
                      a.find(".block:gt(" + n + ")").remove(),
                          a.hasClass("collection-carousel") &&
                              !a.hasClass("slick-initialized") &&
                              nuranium.initNovProductTabsSlider(a.parent()),
                          Currency.convertAll(
                              shopCurrency,
                              $("#currencies span.selected").attr(
                                  "data-currency"
                              )
                          ),
                          nuranium.initNovWishListIcons(),
                          $(".jdgm-prev-badge").length && jdgm.customizeBadges()
                  }
              },
              complete: function () {
                  i.css({ "pointer-events": "auto", opacity: "1" });
              },
          });
      },
      initNovProductTabsSlider: function (t) {
          t.each(function () {
              var t = $(this),
                  a = t.find(".products-grid"),
                  i = !!$("html").hasClass("lang-rtl");
              if (a.not(".slick-initialized")) {
                  function e(t, a) {
                      var i = $(t).find(".slick-slide").length,
                          e = $(t).find(".slick-active").length,
                          n = $(t)
                              .parents("[data-product-tabs]")
                              .find(".nav-slider--prev"),
                          o = $(t)
                              .parents("[data-product-tabs]")
                              .find(".nav-slider--next");
                      i - e == 0
                          ? (n.css("visibility", "hidden"),
                            o.css("visibility", "hidden"))
                          : (n.css("visibility", "visible"),
                            o.css("visibility", "visible")),
                          0 == a
                              ? n.addClass("disabled")
                              : n.removeClass("disabled"),
                          i - e <= a
                              ? o.addClass("disabled")
                              : o.removeClass("disabled");
                  }
                  a.on("init reInit afterChange", function (i, e, n) {
                      let o = a.find(".slick-active").length,
                          s = Math.ceil(((n || 0) + 1) / o),
                          r = Math.ceil(e.slideCount / o);
                      t
                          .parents("[data-product-tabs]")
                          .find(".current_nav")
                          .text(`${s}`),
                          t
                              .parents("[data-product-tabs]")
                              .find(".total_nav")
                              .text(`${r}`),
                          t
                              .parents("[data-product-tabs]")
                              .find(".num_nav")
                              .css("opacity", "1");
                  }),
                      a.slick({
                          nextArrow:
                              '<div class="arrow-next"><i class="rbb-icon-direction-39"></i></div>',
                          prevArrow:
                              '<div class="arrow-prev"><i class="rbb-icon-direction-36"></i></div>',
                          rtl: i,
                          slidesToShow: a.data("items_xxl"),
                          slidesToScroll: a.data("items_xxl"),
                          rows: a.data("row"),
                          row_mobile: a.data("row_mobile"),
                          arrows: a.data("nav"),
                          dots: a.data("dots"),
                          infinite: a.data("loop"),
                          adaptiveHeight: !0,
                          responsive: [
                              {
                                  breakpoint: 1440,
                                  settings: {
                                      slidesToShow: a.data("items"),
                                      slidesToScroll: a.data("items"),
                                  },
                              },
                              {
                                  breakpoint: 1200,
                                  settings: {
                                      slidesToShow: a.data("items_lg"),
                                      slidesToScroll: a.data("items_lg"),
                                      arrows: !1,
                                  },
                              },
                              {
                                  breakpoint: 992,
                                  settings: {
                                      slidesToShow: a.data("items_md"),
                                      slidesToScroll: a.data("items_md"),
                                      arrows: !1,
                                  },
                              },
                              {
                                  breakpoint: 768,
                                  settings: {
                                      slidesToShow: a.data("items_sm"),
                                      slidesToScroll: a.data("items_sm"),
                                      arrows: !1,
                                  },
                              },
                              {
                                  breakpoint: 480,
                                  settings: {
                                      slidesToShow: a.data("items_xs"),
                                      slidesToScroll: a.data("items_xs"),
                                      arrows: !1,
                                      rows: a.data("row_mobile"),
                                  },
                              },
                          ],
                      }),
                      e(this, a.slick("slickCurrentSlide")),
                      $(this).on("afterChange", function (t, a, i, n) {
                          e(this, i);
                      }),
                      $("[data-product-tabs]")
                          .find(".nav-slider--prev")
                          .click(function () {
                              $(this)
                                  .parents("[data-product-tabs]")
                                  .find(".tab-content.active")
                                  .find(a)
                                  .slick("slickPrev");
                          }),
                      $("[data-product-tabs]")
                          .find(".nav-slider--next")
                          .click(function () {
                              $(this)
                                  .parents("[data-product-tabs]")
                                  .find(".tab-content.active")
                                  .find(a)
                                  .slick("slickNext");
                          });
              }
          });
      },
      productItemSwatch: function () {
          $(document).on("change", ".selector-wrapper :radio", function (t) {
              var a,
                  i = $(this),
                  e = i.parents(".item-product"),
                  n = i.parents(".product__popup-swatch"),
                  o = e.data("json-product").variants,
                  s = e.find(".opt-color").data("opt-position"),
                  r = i.closest("[data-option-index]").data("option-index"),
                  d = n.find(".swatch-element"),
                  c = i.val(),
                  l = n.find("[name=id]"),
                  p = n
                      .find(".selector-wrapper-1")
                      .find("input:checked")
                      .val(),
                  u = n
                      .find(".selector-wrapper-2")
                      .find("input:checked")
                      .val(),
                  v = n
                      .find(".selector-wrapper-3")
                      .find("input:checked")
                      .val();
              switch (
                  (d.removeClass("soldout"),
                  d.find(":radio").prop("disabled", !1),
                  r)
              ) {
                  case 0:
                      var m = o.find(function (t) {
                          return 1 == s
                              ? t.option2 == c && t.option1 == u
                              : 2 == s
                              ? t.option3 == c && t.option1 == u
                              : t.option1 == c && t.option2 == u;
                      });
                      if (void 0 != m) a = m;
                      else {
                          var f = o.find(function (t) {
                              return 1 == s
                                  ? t.option2 == c
                                  : 2 == s
                                  ? t.option3 == c
                                  : t.option1 == c;
                          });
                          a = f;
                      }
                      break;
                  case 1:
                      var m = o.find(function (t) {
                          return 1 == s
                              ? t.option2 == p &&
                                    t.option1 == c &&
                                    t.option3 == v
                              : 2 == s
                              ? t.option3 == p &&
                                t.option1 == c &&
                                t.option2 == v
                              : t.option1 == p &&
                                t.option2 == c &&
                                t.option3 == v;
                      });
                      if (void 0 != m) a = m;
                      else {
                          var f = o.find(function (t) {
                              return 1 == s
                                  ? t.option2 == p && t.option1 == c
                                  : 2 == s
                                  ? t.option3 == p && t.option1 == c
                                  : t.option1 == p && t.option2 == c;
                          });
                          a = f;
                      }
                      break;
                  case 2:
                      var m = o.find(function (t) {
                          return 1 == s
                              ? t.option2 == p &&
                                    t.option1 == u &&
                                    t.option3 == c
                              : 2 == s
                              ? t.option3 == p &&
                                t.option1 == u &&
                                t.option2 == c
                              : t.option1 == p &&
                                t.option2 == u &&
                                t.option3 == c;
                      });
                      void 0 != m && (a = m);
              }
              if (void 0 != a) {
                  l.val(a.id),
                      a.compare_at_price > a.price
                          ? e
                                .find("[data-compare-price-grid]")
                                .html(
                                    Shopify.formatMoney(
                                        a.compare_at_price,
                                        theme.moneyFormat
                                    )
                                )
                          : e.find("[data-compare-price-grid]").html(""),
                      e
                          .find("[data-price-grid]")
                          .html(
                              Shopify.formatMoney(a.price, theme.moneyFormat)
                          ),
                      i
                          .parents(".selector-wrapper")
                          .find(".form-label span")
                          .text(c),
                      nuranium.checkStatusSwatch(e, n);
                  var h,
                      _ = n.find(".current_variant_id").attr("value");
                  "continue" ==
                  n
                      .find('.product-form__variants [value="' + _ + '"]')
                      .data("inventory_policy")
                      ? n
                            .find("[data-btn-addtocart] .add-to-cart-text")
                            .text(window.inventory_text.preorder)
                      : n
                            .find("[data-btn-addtocart] .add-to-cart-text")
                            .text(window.inventory_text.add_to_cart),
                      Currency.convertAll(
                          shopCurrency,
                          $("#currencies span.selected").attr("data-currency")
                      );
              }
          }),
              $(document).on(
                  "change",
                  ".item-product__popup--variant select.single-option-selector",
                  function () {
                      var t,
                          a = $(this),
                          i = a.parents(".item-product"),
                          e = a.parents(".product__popup-swatch"),
                          n = i.data("json-product").variants,
                          o = a.data("option"),
                          s = a.val(),
                          r = e.find("[name=id]"),
                          d = e.find('[data-option="option1"]').val(),
                          c = e.find('[data-option="option2"]').val();
                      switch ((e.find('[data-option="option3"]').val(), o)) {
                          case "option1":
                              var l = n.find(function (t) {
                                  return (
                                      t.option1 == s &&
                                      t.option2 == c &&
                                      t.available
                                  );
                              });
                              t =
                                  void 0 != l
                                      ? l
                                      : n.find(function (t) {
                                            return (
                                                t.option1 == s && t.available
                                            );
                                        });
                              break;
                          case "option2":
                              var l = n.find(function (t) {
                                  return (
                                      t.option1 == d &&
                                      t.option2 == s &&
                                      t.available
                                  );
                              });
                              void 0 != l && (t = l);
                              break;
                          case "option3":
                              var l = n.find(function (t) {
                                  return (
                                      t.option1 == d &&
                                      t.option2 == c &&
                                      t.option3 == s &&
                                      t.available
                                  );
                              });
                              void 0 != l && (t = l);
                      }
                      void 0 != t && r.val(t.id),
                          a
                              .parents(".selector-wrapper")
                              .find(".form-label span")
                              .text(s),
                          nuranium.checkStatusSwatch(i, e);
                      var p = e.find(".current_variant_id").attr("value");
                      "continue" ==
                      e
                          .find('.product-form__variants [value="' + p + '"]')
                          .data("inventory_policy")
                          ? e
                                .find(
                                    "[data-btn-addtocart] .add-to-cart-text"
                                )
                                .text(window.inventory_text.preorder)
                          : e
                                .find(
                                    "[data-btn-addtocart] .add-to-cart-text"
                                )
                                .text(window.inventory_text.add_to_cart);
                  }
              );
      },
      initproductItemColorSwatch: function () {
          var t = ".item-swatch li label";
          body
              .off("click.toggleClass")
              .on("click.toggleClass", t, function () {
                  var t = $(this),
                      a = t.attr("data-title").replace(/^\s+|\s+$/g, ""),
                      i = t.closest(".item");
                  t
                      .parents(".item-swatch")
                      .find("li label")
                      .removeClass("active"),
                      t.addClass("active");
                  var e = $(this)
                      .parents(".item-product")
                      .data("json-product");
                  if (
                      (i.find("a").attr("href"),
                      i
                          .find(".product__label-color")
                          .find("[data-change-title]")
                          .text(a),
                      void 0 != t.data("with-one-option"))
                  ) {
                      var n = t.data("quantity"),
                          o = t.data("inventory_policy");
                      i.find('[name="id"]').val(t.data("with-one-option")),
                          n > 0
                              ? (i
                                    .find("[data-btn-addtocart]")
                                    .removeClass("disabled")
                                    .removeAttr("disabled"),
                                "continue" == o
                                    ? i
                                          .find(
                                              "[data-btn-addtocart] .add-to-cart-text"
                                          )
                                          .text(
                                              window.inventory_text.preorder
                                          )
                                    : i
                                          .find(
                                              "[data-btn-addtocart] .add-to-cart-text"
                                          )
                                          .text(
                                              window.inventory_text
                                                  .add_to_cart
                                          ))
                              : (i
                                    .find("[data-btn-addtocart]")
                                    .addClass("disabled")
                                    .attr("disabled", "disabled"),
                                i
                                    .find(
                                        "[data-btn-addtocart] .add-to-cart-text"
                                    )
                                    .text(window.inventory_text.sold_out));
                      var s = t.data("price"),
                          r = t.data("compare_at_price");
                      r > s
                          ? i
                                .find("[data-compare-price-grid]")
                                .html(
                                    Shopify.formatMoney(r, theme.moneyFormat)
                                )
                          : i.find("[data-compare-price-grid]").html(""),
                          i
                              .find("[data-price-grid]")
                              .html(
                                  Shopify.formatMoney(s, theme.moneyFormat)
                              ),
                          Currency.convertAll(
                              shopCurrency,
                              $("#currencies span.selected").attr(
                                  "data-currency"
                              )
                          );
                  } else
                      void 0 != e &&
                          nuranium.checkStatusSwatch(
                              t.parents(".item-product")
                          ),
                          $(".template-collection").length
                              ? t
                                    .parents(".product-collection")
                                    .hasClass("products-list")
                                  ? i
                                        .find(".product-details")
                                        .find('[data-value="' + a + '"]')
                                        .find("label")
                                        .trigger("click")
                                  : i
                                        .find(".product__popup-swatch:eq(0)")
                                        .find('[data-value="' + a + '"]')
                                        .find("label")
                                        .trigger("click")
                              : i
                                    .find('[data-value="' + a + '"]')
                                    .find("label")
                                    .trigger("click");
                  var d = t.data("img");
                  if (d)
                      return (
                          i
                              .find(
                                  ".thumbnail-container .product__thumbnail, .thumbnail-container .product__thumbnail-second"
                              )
                              .attr({
                                  "data-srcset": d,
                                  "data-src": d,
                                  src: d,
                                  srcset: d,
                              }),
                          !1
                      );
              }),
              body
                  .off("click.showmore")
                  .on("click.showmore", ".item-swatch-more a", function (t) {
                      t.preventDefault(),
                          t.stopPropagation(),
                          $(this)
                              .parents(".item-swatch")
                              .toggleClass("show--more"),
                          $(this)
                              .parents(".item-swatch")
                              .hasClass("show--more")
                              ? $(this).children().text("-")
                              : $(this).children().text("+");
                  });
      },
      checkStatusSwatch: function (t, a) {
          if (window.use_color_swatch) {
              var i = t.data("json-product"),
                  e = i.variants,
                  n = t.find("[data-option-index]"),
                  o = t.find(".opt-color").data("opt-position");
              void 0 == a && (a = t);
              var s = a
                      .find('[data-option-index="0"]')
                      .find("input:checked")
                      .val(),
                  r = a
                      .find('[data-option-index="1"]')
                      .find("input:checked")
                      .val();
              a.find('[data-option-index="2"]').find("input:checked").val(),
                  n.each(function () {
                      var t = $(this).data("option-index"),
                          i = $(this).find(".swatch-element");
                      switch (t) {
                          case 0:
                              i.each(function () {
                                  var t = $(this).data("value"),
                                      i = e.find(function (a) {
                                          return 1 == o
                                              ? a.option2 == t && a.available
                                              : 2 == o
                                              ? a.option3 == t && a.available
                                              : a.option1 == t && a.available;
                                      }),
                                      n = e.find(function (a) {
                                          return 1 == o
                                              ? a.option2 == t
                                              : 2 == o
                                              ? a.option3 == t
                                              : a.option1 == t;
                                      });
                                  void 0 == i
                                      ? void 0 == n
                                          ? ($(this).addClass("unavailable"),
                                            $(this).removeClass("soldout"),
                                            $(this).removeClass("available"),
                                            $(this)
                                                .find(":radio")
                                                .prop("checked", !1))
                                          : ($(this).addClass("soldout"),
                                            $(this).removeClass(
                                                "unavailable"
                                            ),
                                            $(this).removeClass("available"),
                                            $(this)
                                                .find(":radio")
                                                .prop("disabled", !1),
                                            $(this).attr(
                                                "data-toggle",
                                                "modal"
                                            ),
                                            $(this).attr(
                                                "data-target",
                                                "#Form_newletter"
                                            ),
                                            a
                                                .find("[data-btn-addtocart]")
                                                .addClass("unavailable")
                                                .attr("disable"))
                                      : ($(this).removeClass("soldout"),
                                        $(this).removeClass("unavailable"),
                                        $(this).addClass("available"),
                                        $(this)
                                            .find(":radio")
                                            .prop("disabled", !1),
                                        $(this).removeAttr(
                                            "data-toggle",
                                            "modal"
                                        ),
                                        $(this).removeAttr(
                                            "data-target",
                                            "#Form_newletter"
                                        ),
                                        a
                                            .find("[data-btn-addtocart]")
                                            .removeClass("unavailable")
                                            .removeAttr("disable"));
                              });
                              break;
                          case 1:
                              i.each(function () {
                                  var t = $(this).data("value"),
                                      i = e.find(function (a) {
                                          return 1 == o
                                              ? a.option2 == s &&
                                                    a.option1 == t &&
                                                    a.available
                                              : 2 == o
                                              ? a.option3 == s &&
                                                a.option1 == t &&
                                                a.available
                                              : a.option1 == s &&
                                                a.option2 == t &&
                                                a.available;
                                      }),
                                      n = e.find(function (a) {
                                          return 1 == o
                                              ? a.option2 == s &&
                                                    a.option1 == t
                                              : 2 == o
                                              ? a.option3 == s &&
                                                a.option1 == t
                                              : a.option1 == s &&
                                                a.option2 == t;
                                      });
                                  void 0 == i
                                      ? void 0 == n
                                          ? ($(this).addClass("unavailable"),
                                            $(this).removeClass("soldout"),
                                            $(this).removeClass("available"),
                                            $(this)
                                                .find(":radio")
                                                .prop("checked", !1))
                                          : ($(this).addClass("soldout"),
                                            $(this).removeClass(
                                                "unavailable"
                                            ),
                                            $(this).removeClass("available"),
                                            $(this)
                                                .find(":radio")
                                                .prop("disabled", !1),
                                            $(this).attr(
                                                "data-toggle",
                                                "modal"
                                            ),
                                            $(this).attr(
                                                "data-target",
                                                "#Form_newletter"
                                            ),
                                            a
                                                .find("[data-btn-addtocart]")
                                                .addClass("unavailable")
                                                .attr("disable"))
                                      : ($(this).removeClass("soldout"),
                                        $(this).removeClass("unavailable"),
                                        $(this).addClass("available"),
                                        $(this)
                                            .find(":radio")
                                            .prop("disabled", !1),
                                        $(this).removeAttr(
                                            "data-toggle",
                                            "modal"
                                        ),
                                        $(this).removeAttr(
                                            "data-target",
                                            "#Form_newletter"
                                        ),
                                        a
                                            .find("[data-btn-addtocart]")
                                            .removeClass("unavailable")
                                            .removeAttr("disable"));
                              });
                              break;
                          case 2:
                              i.each(function () {
                                  var t = $(this).data("value");
                                  $(this).data("inventory_policy");
                                  var i = e.find(function (a) {
                                          return 1 == o
                                              ? a.option2 == s &&
                                                    a.option1 == r &&
                                                    a.option3 == t &&
                                                    a.available
                                              : 2 == o
                                              ? a.option3 == s &&
                                                a.option1 == r &&
                                                a.option2 == t &&
                                                a.available
                                              : a.option1 == s &&
                                                a.option2 == r &&
                                                a.option3 == t &&
                                                a.available;
                                      }),
                                      n = e.find(function (a) {
                                          return 1 == o
                                              ? a.option2 == s &&
                                                    a.option1 == r &&
                                                    a.option3 == t
                                              : 2 == o
                                              ? a.option3 == s &&
                                                a.option1 == r &&
                                                a.option2 == t
                                              : a.option1 == s &&
                                                a.option2 == r &&
                                                a.option3 == t;
                                      });
                                  void 0 == i
                                      ? void 0 == n
                                          ? ($(this).addClass("unavailable"),
                                            $(this).removeClass("soldout"),
                                            $(this).removeClass("available"),
                                            $(this)
                                                .find(":radio")
                                                .prop("checked", !1))
                                          : ($(this).addClass("soldout"),
                                            $(this).removeClass(
                                                "unavailable"
                                            ),
                                            $(this).removeClass("available"),
                                            $(this)
                                                .find(":radio")
                                                .prop("disabled", !1),
                                            $(this).attr(
                                                "data-toggle",
                                                "modal"
                                            ),
                                            $(this).attr(
                                                "data-target",
                                                "#Form_newletter"
                                            ),
                                            a
                                                .find("[data-btn-addtocart]")
                                                .addClass("unavailable")
                                                .attr("disable"))
                                      : ($(this).removeClass("soldout"),
                                        $(this).removeClass("unavailable"),
                                        $(this).addClass("available"),
                                        $(this)
                                            .find(":radio")
                                            .prop("disabled", !1),
                                        $(this).removeAttr(
                                            "data-toggle",
                                            "modal"
                                        ),
                                        $(this).removeAttr(
                                            "data-target",
                                            "#Form_newletter"
                                        ),
                                        a
                                            .find("[data-btn-addtocart]")
                                            .removeClass("unavailable")
                                            .removeAttr("disable"));
                              });
                      }
                  }),
                  a.find(".swatch-element.soldout").find("input:checked")
                      .length
                      ? a
                            .find("[data-btn-addtocart]")
                            .addClass("disabled")
                            .attr("disabled", !0)
                      : a
                            .find("[data-btn-addtocart]")
                            .removeClass("disabled")
                            .removeAttr("disabled"),
                  a
                      .find(".selector-wrapper:not(.opt-color)")
                      .each(function () {
                          $(this)
                              .find(".swatch-element")
                              .find("input:checked").length < 1 &&
                              ($(this).find(".swatch-element.available")
                                  .length
                                  ? $(this)
                                        .find(".swatch-element.available")
                                        .eq("0")
                                        .find("label")
                                        .trigger("click")
                                  : $(this)
                                        .find(".swatch-element.soldout")
                                        .eq("0")
                                        .find("label")
                                        .trigger("click"));
                      });
          } else {
              var i = t.data("json-product"),
                  e = i.variants,
                  n = t.find(".item-product__popup--variant [data-option]"),
                  s = a
                      .find(
                          '.item-product__popup--variant [data-option="option1"]'
                      )
                      .val(),
                  r = a
                      .find(
                          '.item-product__popup--variant [data-option="option2"]'
                      )
                      .val();
              a
                  .find(
                      '.item-product__popup--variant [data-option="option3"]'
                  )
                  .val(),
                  n.each(function () {
                      var t = $(this).data("option-index"),
                          a = $(this).find("option");
                      switch (t) {
                          case 0:
                              a.each(function () {
                                  var t = $(this).val();
                                  void 0 ==
                                  e.find(function (a) {
                                      return a.option1 == t && a.available;
                                  })
                                      ? void 0 ==
                                        e.find(function (a) {
                                            return a.option1 == t;
                                        })
                                          ? ($(this).addClass("unavailable"),
                                            $(this).removeClass("soldOut"),
                                            $(this).attr(
                                                "disabled",
                                                "disabled"
                                            ))
                                          : ($(this).addClass("soldOut"),
                                            $(this).removeClass(
                                                "unavailable"
                                            ),
                                            $(this).removeAttr(
                                                "disabled",
                                                "disabled"
                                            ))
                                      : ($(this).removeAttr(
                                            "disabled",
                                            "disabled"
                                        ),
                                        $(this).removeClass("soldOut"),
                                        $(this).removeClass("unavailable"));
                              });
                              break;
                          case 1:
                              a.each(function () {
                                  var t = $(this).val();
                                  void 0 ==
                                  e.find(function (a) {
                                      return (
                                          a.option1 == s &&
                                          a.option2 == t &&
                                          a.available
                                      );
                                  })
                                      ? void 0 ==
                                        e.find(function (a) {
                                            return (
                                                a.option1 == s &&
                                                a.option2 == t
                                            );
                                        })
                                          ? ($(this).addClass("unavailable"),
                                            $(this).removeClass("soldOut"),
                                            $(this).attr(
                                                "disabled",
                                                "disabled"
                                            ))
                                          : ($(this).addClass("soldOut"),
                                            $(this).removeClass(
                                                "unavailable"
                                            ),
                                            $(this).removeAttr(
                                                "disabled",
                                                "disabled"
                                            ))
                                      : ($(this).removeAttr(
                                            "disabled",
                                            "disabled"
                                        ),
                                        $(this).removeClass("soldOut"),
                                        $(this).removeClass("unavailable"));
                              });
                              break;
                          case 2:
                              a.each(function () {
                                  var t = $(this).val();
                                  void 0 ==
                                  e.find(function (a) {
                                      return (
                                          a.option1 == s &&
                                          a.option2 == r &&
                                          a.option3 == t &&
                                          a.available
                                      );
                                  })
                                      ? void 0 ==
                                        e.find(function (a) {
                                            return (
                                                a.option1 == s &&
                                                a.option2 == r &&
                                                a.option3 == t
                                            );
                                        })
                                          ? ($(this).addClass("unavailable"),
                                            $(this).removeClass("soldOut"),
                                            $(this).attr(
                                                "disabled",
                                                "disabled"
                                            ))
                                          : ($(this).addClass("soldOut"),
                                            $(this).removeClass(
                                                "unavailable"
                                            ),
                                            $(this).removeAttr(
                                                "disabled",
                                                "disabled"
                                            ))
                                      : ($(this).removeAttr(
                                            "disabled",
                                            "disabled"
                                        ),
                                        $(this).removeClass("soldOut"),
                                        $(this).removeClass("unavailable"));
                              });
                      }
                  }),
                  a
                      .find(
                          ".item-product__popup--variant .single-option-selector"
                      )
                      .find("option.soldOut:selected").length
                      ? a
                            .find("[data-btn-addtocart]")
                            .addClass("disabled")
                            .attr("disabled", !0)
                      : a
                            .find("[data-btn-addtocart]")
                            .removeClass("disabled")
                            .removeAttr("disabled");
          }
      },
      initNovWishListsPage: function () {
          "undefined" != typeof Storage
              ? !(wishListsArr.length <= 0) &&
                wishListsArr.forEach(function (t) {
                    nuranium.createNovWishListTplItem(t);
                })
              : alert("Storage no support!");
      },
      initNovWishListIcons: function () {
          if (wishListsArr.length) {
              for (var t = 0; t < wishListsArr.length; t++) {
                  var a = $(
                      '[data-product-handle="' + wishListsArr[t] + '"]'
                  );
                  a.addClass("whislist-added"),
                      a.find(".wishlist-text").text("Remove Wish List");
              }
              if ("undefined" != typeof Storage) {
                  if (wishListsArr.length <= 0) return;
                  setTimeout(function () {
                      wishListsArr.forEach(function (t) {
                          nuranium.setNovAddedForWishlistIcon(t);
                      });
                  }, 1e3);
              } else alert("Storage no support!");
          }
      },
      setNovAddedForWishlistIcon: function (t) {
          var a = $('[data-product-handle="' + t + '"]');
          wishListsArr.indexOf(t) >= 0
              ? (a.addClass("whislist-added"),
                a.find(".wishlist-text").text("Remove Wish List"))
              : (a.removeClass("whislist-added"),
                a.find(".wishlist-text").text("Add to Wish List"));
      },
      doAddOrRemoveWishlist: function () {
          var t = ".item-product [data-icon-wishlist]";
          $(document)
              .off("click.addOrRemoveWishlist", t)
              .on("click.addOrRemoveWishlist", t, function (t) {
                  t.preventDefault();
                  var a = $(this),
                      i = a.data("id"),
                      e = a.data("product-handle"),
                      n = wishListsArr.indexOf(e);
                  if (a.hasClass("whislist-added"))
                      a.removeClass("whislist-added"),
                          a.find(".wishlist-text").text("Add to Wish List"),
                          $('[data-wishlist-added="wishlist-' + i + '"]')
                              .length &&
                              $(
                                  '[data-wishlist-added="wishlist-' + i + '"]'
                              ).remove(),
                          wishListsArr.splice(n, 1),
                          localStorage.setItem(
                              "wishListsArr",
                              JSON.stringify(wishListsArr)
                          );
                  else {
                      a.addClass("whislist-added"),
                          a.find(".wishlist-text").text("Remove Wish List");
                      var o = a
                              .parents(".item-product")
                              .find(".product__title")
                              .html(),
                          s = a
                              .parents(".item-product")
                              .find(".product__thumbnail")
                              .attr("src");
                      $(".loading-modal").find(".product-title").html(o),
                          $(".loading-modal")
                              .find(".product-image")
                              .attr("src", s),
                          $(".loading-modal").find(".btn-wishlist").show(),
                          $(".loading-modal").css({
                              display: "block",
                              opacity: "1",
                              visibility: "initial",
                              transform: "translateX(0)",
                              transition: "all 0.3s",
                          }),
                          setTimeout(function () {
                              $(".loading-modal").css({
                                  opacity: "0",
                                  visibility: "hidden",
                                  transform: "translateX(410px)",
                                  transition: "all 0.3s",
                              });
                          }, 5e3),
                          $("[data-wishlist-container]").length &&
                              nuranium.createNovWishListTplItem(e),
                          wishListsArr.push(e),
                          localStorage.setItem(
                              "wishListsArr",
                              JSON.stringify(wishListsArr)
                          );
                  }
                  nuranium.setNovAddedForWishlistIcon(e);
              });
      },
      createNovWishListTplItem: function (t) {
          var a = $("[data-wishlist-container]");
          jQuery.getJSON(
              window.router + "/products/" + t + ".js",
              function (t) {
                  var i = "",
                      e = Shopify.formatMoney(t.price_min, theme.moneyFormat),
                      n = Shopify.formatMoney(
                          t.compare_at_price_min,
                          theme.moneyFormat
                      );
                  JSON.stringify(t.variants),
                      JSON.stringify(t.media),
                      (i +=
                          '<div class="item col-lg-3 col-md-4 col-6" data-wishlist-added="wishlist-' +
                          t.id +
                          '">'),
                      (i +=
                          '<div class="item-product" data-product-id="product-' +
                          t.handle +
                          '">'),
                      (i += '<div class="inner-top">'),
                      void 0 !== t.images[1]
                          ? (i +=
                                '<div class="product-top thumbnail-container has-multiimage">')
                          : (i +=
                                '<div class="product-top thumbnail-container">'),
                      (i += '<a href="' + t.url + '">'),
                      (i +=
                          '<img class="product__thumbnail" src="' +
                          t.featured_image +
                          '" alt="' +
                          t.featured_image.alt +
                          '">'),
                      void 0 !== t.images[1] &&
                          (i +=
                              '<img class="product__thumbnail-second" src="' +
                              t.images[1] +
                              '" alt="' +
                              t.images[1].alt +
                              '">'),
                      (i += "</a>"),
                      (i += '<div class="button--top">'),
                      (i += '<div class="productWishList">'),
                      (i +=
                          '<a class="btnProductWishlist item-product__wishlist whislist-added" data-icon-wishlist href="#" data-product-handle="' +
                          t.handle +
                          '" data-id="' +
                          t.id +
                          '">'),
                      (i += '<i class="zmdi zmdi-favorite"></i>'),
                      (i += "</a>"),
                      (i += "</div>"),
                      (i +=
                          '<div class="productQuickView d-none d-md-block">'),
                      (i +=
                          '<a class="btnProductQuickview" href="#" data-url="/products/' +
                          t.handle +
                          '?view=quick_view" data-product-url="/products/' +
                          t.handle +
                          '"  data-handle="' +
                          t.handle +
                          '" data-pid="' +
                          t.id +
                          '">'),
                      (i += '<i class="zmdi zmdi-collection-image-o"></i>'),
                      (i += "</a>"),
                      (i += "</div>"),
                      (i += "</div>"),
                      (i += "</div>"),
                      (i += '<div class="product__info">'),
                      (i +=
                          '<div class="product__title"><a href="' +
                          t.url +
                          '" title="' +
                          t.title +
                          '">' +
                          t.title +
                          "</a></div>"),
                      n > e
                          ? ((i += '<div class="price-sale">'),
                            (i +=
                                '<span class="special-price" data-price-grid>' +
                                e +
                                "</span>"),
                            (i +=
                                '<span class="old-price" data-compare-price-grid>' +
                                n +
                                "</span>"),
                            (i += "</div>"))
                          : ((i += '<div class="price-regular">'),
                            (i += "<span data-price-grid>" + e + "</span>"),
                            (i += "</div>")),
                      (i += "</div></div></div>"),
                      a.append(i);
              }
          );
      },
      ajaxAddToCart: function () {
          $(document).on("click", "button.btnAddToCart", function (t) {
              var a = $(this);
              t.preventDefault(),
                  a.css("pointer-events", "none").addClass("loading"),
                  $.ajax({
                      type: "POST",
                      url: "/cart/add.js",
                      data: a.parents("form").serialize(),
                      dataType: "json",
                      success: function (t) {
                          $.get("/cart?view=json", function (t) {
                              $("#cart-info").html(t);
                          }).always(function () {
                              Currency.convertAll(
                                  shopCurrency,
                                  $("#currencies span.selected").attr(
                                      "data-currency"
                                  )
                              ),
                                  nuranium.initAddToCart(t.image, t.title),
                                  nuranium.initCartExtend(),
                                  nuranium.updateMiniCart(),
                                  nuranium.PopupAddToCart(),
                                  a
                                      .parents("form")
                                      .find(".product-form__item-error")
                                      .addClass("hidden"),
                                  a
                                      .css("pointer-events", "auto")
                                      .removeClass("loading"),
                                  $(document)
                                      .find(".quickviewClose")
                                      .trigger("click");
                          });
                      },
                      error: function (t, i) {
                          a
                              .removeClass("loading")
                              .css("pointer-events", "auto"),
                              a
                                  .parents("form")
                                  .find(".product-form__item-error")
                                  .removeClass("hidden");
                      },
                  });
          });
      },
      initAddToCart: function (t, a) {
          $.ajax({
              url: "/cart/?view=upsell",
              dataType: "html",
              type: "GET",
              beforeSend: function () {
                  $("body").addClass("cart_popup_opened");
              },
              success: function (t) {
                  $.magnificPopup.open({
                      items: {
                          src:
                              '<div class="nov-with-anim product-quickview popup-quick-view cart__popup cart__popup_upsell"><div id="content_cart__popup_nt">' +
                              t +
                              "</div></div>",
                          type: "inline",
                      },
                      removalDelay: 500,
                      closeMarkup:
                          '<i class="zmdi zmdi-hc-fw zmdi-close"></i>',
                      callbacks: {
                          beforeOpen: function () {
                              this.st.mainClass = "nov-move-horizontal";
                          },
                          open: function () {
                              nuranium.PopupAddToCart(),
                                  Currency.convertAll(
                                      shopCurrency,
                                      $("#currencies span.selected").attr(
                                          "data-currency"
                                      )
                                  );
                          },
                          change: function () {},
                          close: function () {
                              $("body").hasClass("template-cart")
                                  ? window.location.reload()
                                  : ($("body").removeClass(
                                        "cart_popup_opened"
                                    ),
                                    $("body").removeClass(
                                        "open_quick_variants"
                                    ),
                                    $("body").removeClass("loading"),
                                    $("#content_cart__popup_nt").empty());
                          },
                      },
                  });
              },
              complete: function () {
                  if (
                      (nuranium.PopupAddToCart(),
                      Currency.convertAll(
                          shopCurrency,
                          $("#currencies span.selected").attr("data-currency")
                      ),
                      $(".loader").remove(),
                      a)
                  ) {
                      var t =
                          '<div class="cart-message d-flex align-items-center mb-20"><i class="zmdi zmdi-notifications-active"></i><strong>' +
                          a +
                          "</strong> - " +
                          theme.strings.cart_message_html +
                          "</div>";
                      $(".cart-popup__content").prepend(t);
                  }
              },
              error: function () {
                  $(".loader").remove();
              },
          });
      },
      updateMiniCart: function () {
          Shopify.getCart(function (t) {
              nuranium.doUpdateMiniCart(t);
          });
      },
      doUpdateMiniCart: function (t) {
          $("#CartCount, #CartCountCavas").text(t.item_count),
              $("#cart_total").html(
                  Shopify.formatMoney(t.total_price, theme.moneyFormat)
              ),
              $(".cart-popup-heading span").html(
                  "There are " + t.item_count + " item(s) in your cart"
              );
      },
      ajaxChangeFromCart: function () {
          $(document).on(
              "change",
              ".cart__popup-qty--input, .cart__mini-qty--input",
              function (t) {
                  t.preventDefault();
              }
          );
      },
      PopupAddToCart: function () {
          function t(t, a) {
              $(".cart__popup").addClass("loading"),
                  $.ajax({
                      type: "POST",
                      url: "/cart/change.js",
                      data: "quantity=" + a + "&id=" + t,
                      dataType: "json",
                      success: function (i) {
                          jQuery
                              .get("/cart?view=up_ajax", function (i) {
                                  i = jQuery(i);
                                  var e = jQuery(i),
                                      n = jQuery(e.get(0)).html(),
                                      o = jQuery(e.get(2)).html(),
                                      s = $(".cart__popup #" + t).find(
                                          ".cart__popup-total .amount"
                                      );
                                  $(".cart__popup #" + t)
                                      .find(".cart__popup-qty--input")
                                      .val(a);
                                  var r = parseFloat(s.data("price")) * a;
                                  s.html(
                                      Shopify.formatMoney(
                                          r,
                                          theme.moneyFormat
                                      )
                                  ),
                                      $("#cart__popup_total").html(n),
                                      $("#threshold_bar_popup").html(o);
                              })
                              .always(function () {
                                  Currency.convertAll(
                                      shopCurrency,
                                      $("#currencies span.selected").attr(
                                          "data-currency"
                                      )
                                  ),
                                      $(".cart__popup").removeClass(
                                          "loading"
                                      );
                              }),
                              $.get("/cart?view=json", function (t) {
                                  $("#cart-info").html(t);
                              }).always(function () {
                                  Currency.convertAll(
                                      shopCurrency,
                                      $("#currencies span.selected").attr(
                                          "data-currency"
                                      )
                                  ),
                                      nuranium.updateMiniCart();
                              });
                      },
                      error: function (t, a) {
                          $(".cart__popup").removeClass("loading");
                      },
                  });
          }
          $(document).on("click", ".cart__popup-qty", function (a) {
              a.preventDefault();
              var i = $(this),
                  e = i.siblings(".cart__popup-qty--input"),
                  n = e.attr("data-id"),
                  o = parseFloat(e.val()),
                  s = parseFloat(e.attr("step")),
                  r = parseFloat(e.attr("min")),
                  d = parseFloat(e.attr("max"));
              if (i.hasClass("cart__popup-qty--plus")) {
                  var c = o + s;
                  if (c > d && d > 0) {
                      e.val(d);
                      return;
                  }
              } else if (i.hasClass("cart__popup-qty--minus")) {
                  var c = o - s;
                  if (0 === c) {
                      var l = parseInt(e.attr("value"));
                      e.val(l),
                          i
                              .parents(".cart__popup-item")
                              .find(".cart__popup-remove")
                              .trigger("click");
                      return;
                  }
                  if (c < r) return;
                  if (o < 0) {
                      alert("Invalid");
                      return;
                  }
              }
              t(n, c);
          }),
              $(document).on("click", ".cart__popup-remove", function (t) {
                  t.preventDefault(), $(".cart__popup").addClass("loading");
                  var a = $(this),
                      i = a
                          .siblings(".cart__popup-quantity")
                          .find(".cart__popup-qty--input"),
                      e = a.find("a").attr("data-product-id"),
                      n = parseInt(i.val());
                  ($ptitle = a
                      .parent(".cart__popup-item")
                      .find(".cart__popup-title a")
                      .text()),
                      $(".cart__popup").addClass("loading"),
                      $.ajax({
                          type: "POST",
                          url: "/cart/change.js",
                          data: "quantity=0&id=" + e,
                          dataType: "json",
                          success: function (t) {
                              jQuery
                                  .get("/cart?view=up_ajax", function (t) {})
                                  .always(function (t) {
                                      t = jQuery(t);
                                      var i = jQuery(t),
                                          o = jQuery(i.get(0)).html(),
                                          s = jQuery(i.get(2)).html();
                                      $("#cart__popup_total").html(o),
                                          $("#threshold_bar_popup").html(s),
                                          $(".cart__popup #" + e).addClass(
                                              "hide"
                                          ),
                                          n > 0
                                              ? $("#" + e + " input").val(n)
                                              : $(
                                                    ".cart__popup #" +
                                                        e +
                                                        " input"
                                                ).val(1),
                                          Currency.convertAll(
                                              shopCurrency,
                                              $(
                                                  "#currencies span.selected"
                                              ).attr("data-currency")
                                          ),
                                          $(
                                              ".cart__popup .cart-message"
                                          ).html(
                                              '<i class="rbb-icon-delete-outline-2"></i> <strong>' +
                                                  $ptitle +
                                                  "</strong> - has been removed into your shopping cart."
                                          ),
                                          $(".cart__popup .cart-message")
                                              .removeClass("removed")
                                              .addClass("removed"),
                                          $(".cart__popup").removeClass(
                                              "loading"
                                          ),
                                          a
                                              .parents(".cart__popup-item")
                                              .remove();
                                  }),
                                  $.get("/cart?view=json", function (t) {
                                      $("#cart-info").html(t);
                                  }).always(function () {
                                      Currency.convertAll(
                                          shopCurrency,
                                          $("#currencies span.selected").attr(
                                              "data-currency"
                                          )
                                      ),
                                          nuranium.updateMiniCart();
                                  });
                          },
                      });
              });
      },
      initMiniCart: function () {
          jQuery.getJSON("/cart.js", function (t) {
              if (
                  ($("#CartCount, #CartCountCavas").text(t.item_count),
                  $("#cart-info").html(""),
                  $("#desktop_cart").addClass("item_count"),
                  t.item_count > 0)
              ) {
                  var a = "";
                  (a +=
                      '<form action="/cart" method="post" class="cart ajaxcart">'),
                      (a +=
                          '<input class="js-form-discount" type="hidden" name="discount" value="">'),
                      (a += '<div class="ajaxcart__inner">'),
                      (a += '<div class="ajaxcart__inner--content">');
                  for (var i = 0; i < t.items.length; i++) {
                      var e = Shopify.resizeImage(t.items[i].image, "220x"),
                          n = Shopify.formatMoney(
                              t.items[i].price,
                              theme.moneyFormat
                          );
                      (a +=
                          '<div class="ajaxcart__product" data-line="' +
                          i +
                          '">'),
                          (a += '<div class="media">'),
                          (a +=
                              '<a href="' +
                              t.items[i].url +
                              '" class="position-relative">'),
                          (a +=
                              '<img class="d-flex product-image" src="' +
                              e +
                              '" alt="' +
                              t.items[i].title +
                              '" title="' +
                              t.items[i].title +
                              '">'),
                          (a += "</a>"),
                          (a += '<div class="media-body">'),
                          (a +=
                              '<a class="product-name" href="' +
                              t.items[i].url +
                              '">'),
                          (a +=
                              '<span class="title">' +
                              t.items[i].product_title +
                              "</span>"),
                          t.items[i].variant_title &&
                              (a +=
                                  '<span class="bt_s">' +
                                  t.items[i].variant_title +
                                  "</span>"),
                          (a += "</a>"),
                          (a += '<div class="mb-5"></div>'),
                          (a +=
                              '<span class="product-price"><span class="money">' +
                              n +
                              "</span></span>"),
                          (a +=
                              '<div class="cart__item-bottom d-flex align-items-center mt-10">'),
                          (a +=
                              '<div class="cart__mini--qty d-flex align-items-center">'),
                          (a +=
                              '<a class="cart__mini-qty cart__mini-qty--minus" href="javascript:void(0);">-</a>'),
                          (a +=
                              '<input class="cart__mini-qty--input" type="number" name="updates[]" id="updates_' +
                              t.items[i].key +
                              '" data-price="' +
                              t.items[i].price +
                              '" data-id="' +
                              t.items[i].id +
                              '" data-line="' +
                              i +
                              '" step="1" value="' +
                              t.items[i].quantity +
                              '" min="1" max="" pattern="[0-9]*" />'),
                          (a +=
                              '<a class="cart__mini-qty cart__mini-qty--plus" href="javascript:void(0);">+</a>'),
                          (a += "</div>"),
                          (a +=
                              '<span class="remove-from-cart" rel="nofollow" href="#" title="remove from cart" data-line="' +
                              i +
                              '" data-product-id="' +
                              t.items[i].id +
                              '"><i class="rbb-icon-delete-outline-2"></i></span>'),
                          (a += "</div>"),
                          (a += "</div>"),
                          (a += "</div>"),
                          (a += "</div>");
                  }
                  (a += "</div>"),
                      (a += "</div>"),
                      (a += '<div class="ajaxcart__footer">'),
                      (a +=
                          '<div class="subtotal d-flex align-items-center justify-content-between">'),
                      (a += "<label>" + theme.strings.total + "</label>"),
                      (a +=
                          "<span>" +
                          Shopify.formatMoney(
                              t.total_price,
                              theme.moneyFormat
                          ) +
                          "</span>"),
                      (a += "</div>"),
                      (a +=
                          '<div class="cart_extend--label row spacing-0 d-md-none mb-15">'),
                      !0 == theme.cart_note &&
                          ((a +=
                              '<div class="extend--label__item col" data-label="note">'),
                          (a +=
                              '<svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.90371 16.5062V14.553L15.8459 8.61073L17.7992 10.564L11.8569 16.5062H9.90371ZM0 10.729V9.0784H8.2531V10.729H0ZM18.9821 9.38102L17.0289 7.42779L17.8267 6.62999C17.9734 6.48326 18.166 6.4099 18.4044 6.4099C18.6428 6.4099 18.8354 6.48326 18.9821 6.62999L19.7799 7.42779C19.9266 7.57451 20 7.76708 20 8.0055C20 8.24392 19.9266 8.4365 19.7799 8.58322L18.9821 9.38102ZM0 6.18982V4.5392H12.9298V6.18982H0ZM0 1.65062V0H12.9298V1.65062H0Z" fill="black"/></svg>'),
                          (a += '<i class="zmdi zmdi-close"></i>'),
                          (a += "</div>")),
                      !0 == theme.cart_shipping_calculator &&
                          ((a +=
                              '<div class="extend--label__item col" data-label="estimate-shipping">'),
                          (a +=
                              '<svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.18182 14.5227C3.43939 14.5227 2.80682 14.2614 2.28409 13.7386C1.76136 13.2159 1.5 12.5833 1.5 11.8409H0V1.36364C0 1 0.136364 0.681818 0.409091 0.409091C0.681818 0.136363 1 0 1.36364 0H14.5227V3.79545H16.9091L20 7.90909V11.8409H18.3864C18.3864 12.5833 18.125 13.2159 17.6023 13.7386C17.0795 14.2614 16.447 14.5227 15.7045 14.5227C14.9621 14.5227 14.3295 14.2614 13.8068 13.7386C13.2841 13.2159 13.0227 12.5833 13.0227 11.8409H6.86364C6.86364 12.5833 6.60227 13.2159 6.07955 13.7386C5.55682 14.2614 4.92424 14.5227 4.18182 14.5227ZM4.18182 13.1591C4.54545 13.1591 4.85606 13.0303 5.11364 12.7727C5.37121 12.5152 5.5 12.2045 5.5 11.8409C5.5 11.4773 5.37121 11.1667 5.11364 10.9091C4.85606 10.6515 4.54545 10.5227 4.18182 10.5227C3.81818 10.5227 3.50758 10.6515 3.25 10.9091C2.99242 11.1667 2.86364 11.4773 2.86364 11.8409C2.86364 12.2045 2.99242 12.5152 3.25 12.7727C3.50758 13.0303 3.81818 13.1591 4.18182 13.1591ZM1.36364 10.4773H1.86364C2.12121 10.0682 2.44697 9.74242 2.84091 9.5C3.23485 9.25758 3.67424 9.13636 4.15909 9.13636C4.64394 9.13636 5.08712 9.26136 5.48864 9.51136C5.89015 9.76136 6.2197 10.0833 6.47727 10.4773H13.1591V1.36364H1.36364V10.4773ZM15.7045 13.1591C16.0682 13.1591 16.3788 13.0303 16.6364 12.7727C16.8939 12.5152 17.0227 12.2045 17.0227 11.8409C17.0227 11.4773 16.8939 11.1667 16.6364 10.9091C16.3788 10.6515 16.0682 10.5227 15.7045 10.5227C15.3409 10.5227 15.0303 10.6515 14.7727 10.9091C14.5152 11.1667 14.3864 11.4773 14.3864 11.8409C14.3864 12.2045 14.5152 12.5152 14.7727 12.7727C15.0303 13.0303 15.3409 13.1591 15.7045 13.1591ZM14.5227 8.52273H18.75L16.2273 5.15909H14.5227V8.52273Z" fill="black"/></svg>'),
                          (a += '<i class="zmdi zmdi-close"></i>'),
                          (a += "</div>")),
                      !0 == theme.cart_discount_code &&
                          ((a +=
                              '<div class="extend--label__item col" data-label="discount">'),
                          (a +=
                              '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.95268 13.905L13.0909 10.755C13.2553 10.59 13.3748 10.4062 13.4496 10.2037C13.5243 10.0012 13.5616 9.7875 13.5616 9.5625C13.5616 9.0825 13.3935 8.67375 13.0573 8.33625C12.721 7.99875 12.3138 7.83 11.8356 7.83C11.5367 7.83 11.2379 7.9275 10.939 8.1225C10.6401 8.3175 10.3113 8.6325 9.95268 9.0675C9.59402 8.6325 9.26525 8.3175 8.96638 8.1225C8.6675 7.9275 8.36862 7.83 8.06974 7.83C7.59153 7.83 7.18431 7.99875 6.84807 8.33625C6.51183 8.67375 6.34371 9.0825 6.34371 9.5625C6.34371 9.7875 6.38107 10.0012 6.45579 10.2037C6.53051 10.4062 6.65006 10.59 6.81445 10.755L9.95268 13.905ZM9.77335 18C9.59402 18 9.42217 17.97 9.25778 17.91C9.0934 17.85 8.93649 17.7525 8.78705 17.6175L0.381071 9.18C0.246575 9.03 0.14944 8.8725 0.0896637 8.7075C0.0298878 8.5425 0 8.37 0 8.19V1.35C0 0.96 0.127024 0.6375 0.381071 0.3825C0.635118 0.1275 0.956413 0 1.34496 0H8.1594C8.33873 0 8.51806 0.0262501 8.69738 0.0787501C8.87671 0.13125 9.0411 0.2325 9.19053 0.3825L17.5517 8.775C17.8506 9.075 18 9.40875 18 9.77625C18 10.1437 17.8506 10.4775 17.5517 10.7775L10.7372 17.6175C10.6177 17.7375 10.472 17.8313 10.3001 17.8988C10.1283 17.9663 9.95268 18 9.77335 18ZM9.77335 16.65L16.5878 9.81L8.1594 1.35H1.34496V8.19L9.77335 16.65ZM3.69863 4.86C4.01245 4.86 4.28518 4.74375 4.51681 4.51125C4.74844 4.27875 4.86426 4.005 4.86426 3.69C4.86426 3.375 4.74844 3.10125 4.51681 2.86875C4.28518 2.63625 4.01245 2.52 3.69863 2.52C3.38481 2.52 3.11208 2.63625 2.88045 2.86875C2.64882 3.10125 2.533 3.375 2.533 3.69C2.533 4.005 2.64882 4.27875 2.88045 4.51125C3.11208 4.74375 3.38481 4.86 3.69863 4.86V4.86Z" fill=""/></svg>'),
                          (a += '<i class="zmdi zmdi-close"></i>'),
                          (a += "</div>")),
                      (a += "</div>");
                  var n = t.total_price,
                      o = theme.freeshipping_value;
                  if (!0 == theme.show_free_shipping) {
                      if (parseFloat(n / 100) < parseFloat(o)) {
                          var s = (
                              parseFloat(o) - parseFloat(n / 100)
                          ).toFixed(0);
                          (a += '<div id="threshold_bar_popup_minicart">'),
                              (a += '<div class="cart_threshold">'),
                              (a +=
                                  '<div class="threshold_spend">' +
                                  theme.strings.spend +
                                  " " +
                                  Shopify.formatMoney(
                                      100 * s,
                                      theme.moneyFormat
                                  ) +
                                  " " +
                                  theme.strings.spend__html +
                                  "</div>"),
                              (a += '<div class="threshold_bar">'),
                              (a +=
                                  '<span class="animate" style="width:' +
                                  (n / o).toFixed(0) +
                                  '%!important">'),
                              (a +=
                                  "<span>" + (n / o).toFixed(0) + "%</span>"),
                              (a += "</span>"),
                              (a += "</div>"),
                              (a += "</div>"),
                              (a += "</div>");
                      } else
                          (a += '<div id="threshold_bar_popup_minicart">'),
                              (a +=
                                  '<div class="threshold_spend spend_congrats"><span>' +
                                  theme.strings.content_threshold +
                                  '<i class="rbb-icon-delivery-11"></i></span></div>'),
                              (a +=
                                  '<div class="threshold_bar threshold_congrats"><span class="animate" style="width: 100% !important;"><span>100%</span></div>'),
                              (a += "</div>");
                  }
                  (a += '<div class="btn_submit">'),
                      (a +=
                          '<input type="checkbox" name="checkout__input" value="1" id="checkout__canvas" class="hide">'),
                      (a +=
                          '<a href="/cart" class="btn btn-success"><span>' +
                          theme.strings.view_cart +
                          "</span></a>"),
                      (a +=
                          '<button type="submit" class="btn cart__checkout" name="checkout"><span>' +
                          theme.strings.check_out +
                          "</span></button>"),
                      (a +=
                          '<label for="checkout__canvas" class="d-flex align-items-center mt-20">'),
                      (a +=
                          '<span class="custom-checkbox pointer d-inline-flex align-items-center justify-content-center"><i class="zmdi zmdi-check"></i></span>'),
                      (a +=
                          '<span class="label__text">' +
                          theme.proceed_to_checkout +
                          "</span>"),
                      (a += "</label>"),
                      (a += "</div>"),
                      (a += "</div>"),
                      (a += "</form>"),
                      $("#cart-info").append(a),
                      $("#cart_total").html(
                          Shopify.formatMoney(
                              t.total_price,
                              theme.moneyFormat
                          )
                      ),
                      Currency.convertAll(
                          shopCurrency,
                          $("#currencies span.selected").attr("data-currency")
                      );
                  var i = $(".ajaxcart__inner").outerHeight(),
                      r = $(".ajaxcart__footer").outerHeight(),
                      d = $(".ajaxcart").height() - 30;
                  i + r >= d && $(".ajaxcart__footer").addClass("h_scroll"),
                      nuranium.initCartExtend();
              } else {
                  var c = $(".link_to_collection_cart_empty").html(),
                      a = "";
                  (a += '<div class="cart cart_empty">'),
                      (a +=
                          '<div class="empty_title text-center">' +
                          theme.strings.cart_empty +
                          "</div>"),
                      (a +=
                          '<div class="text-center mt-40 block_link_cart">'),
                      (a += "" + c),
                      (a += "</div>"),
                      (a += "</div>"),
                      $("#cart-info").append(a),
                      $("#cart_total").html("$0"),
                      $("#desktop_cart").removeClass("item_count"),
                      $(".form-cart__extent").remove();
              }
          });
      },
      ajaxProductAddToCart: function () {
          $(document).on("click", ".product-form__cart-submit", function (t) {
              t.preventDefault();
              var a = $(this);
              a.css("pointer-events", "none").addClass("loading"),
                  $(".lookbook-modal").modal("hide"),
                  $.ajax({
                      type: "POST",
                      url: "/cart/add.js",
                      data: a.parents("form").serialize(),
                      dataType: "json",
                      success: function (t) {
                          $.get("/cart?view=json", function (t) {
                              $("#cart-info").html(t);
                          }).always(function () {
                              Currency.convertAll(
                                  shopCurrency,
                                  $("#currencies span.selected").attr(
                                      "data-currency"
                                  )
                              ),
                                  nuranium.initAddToCart(t.image, t.title),
                                  nuranium.initCartExtend(),
                                  nuranium.updateMiniCart(),
                                  nuranium.PopupAddToCart(),
                                  a
                                      .css("pointer-events", "auto")
                                      .removeClass("loading");
                          });
                      },
                      complete: function () {
                          $("body").removeClass("cart_popup_opened"),
                              $("body").removeClass("loading"),
                              $(
                                  ".nov-close, .cart_popup_opened .nov-ready"
                              ).on("click", function () {
                                  $("body").hasClass("template-cart") &&
                                      window.location.reload();
                              });
                      },
                      error: function (t, i) {
                          a.removeClass("loading")
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
          $(document).on("click", ".btnProductQuickview", function (t) {
              t.preventDefault(), $(".lookbook-modal").modal("hide");
              var a = $(this);
              $.ajax({
                  beforeSend: function () {
                      $("body").addClass("open_gl_quick_view");
                  },
                  url: a.attr("data-url"),
                  success: function (t) {
                      $.magnificPopup.open({
                          items: {
                              src:
                                  '<div class="nov-with-anim popup-quick-view" id="content_quickview">' +
                                  t +
                                  "</div>",
                              type: "inline",
                          },
                          removalDelay: 500,
                          closeMarkup:
                              '<i class="zmdi zmdi-hc-fw zmdi-close"></i>',
                          callbacks: {
                              beforeOpen: function () {
                                  this.st.mainClass = "nov-move-horizontal";
                              },
                              open: function () {
                                  (rtl = !!$("html").hasClass("lang-rtl")),
                                      $(".quickview_slick").slick({
                                          nextArrow:
                                              '<div class="arrow-next"><i class="zmdi zmdi-chevron-right"></i></div>',
                                          prevArrow:
                                              '<div class="arrow-prev"><i class="zmdi zmdi-chevron-left"></i></div>',
                                          rtl: rtl,
                                          slidesToShow: 1,
                                          slidesToScroll: 1,
                                          arrows: !0,
                                          dots: !1,
                                          infinite: !0,
                                          adaptiveHeight: !0,
                                      }),
                                      $("variant-radios label").click(
                                          function () {
                                              setTimeout(function () {
                                                  var t = $(
                                                      ".quickview_slick"
                                                  )
                                                      .find(".item.act")
                                                      .attr(
                                                          "data-slick-index"
                                                      );
                                                  $(".quickview_slick").slick(
                                                      "slickGoTo",
                                                      t
                                                  );
                                              }, 300);
                                          }
                                      ),
                                      Shopify.PaymentButton.init(),
                                      Currency.convertAll(
                                          shopCurrency,
                                          $("#currencies span.selected").attr(
                                              "data-currency"
                                          )
                                      ),
                                      setTimeout(function () {
                                          if (
                                              $(
                                                  ".shopify-product-reviews-badge"
                                              ).length &&
                                              $(".spr-badge").length
                                          )
                                              return (
                                                  window.SPR.registerCallbacks(),
                                                  window.SPR.initRatingHandler(),
                                                  window.SPR.initDomEls(),
                                                  window.SPR.loadProducts(),
                                                  window.SPR.loadBadges()
                                              );
                                      }, 1e3),
                                      nuranium.initNovWishListIcons(),
                                      jdgm.customizeBadges(),
                                      jQuery("variant-radios :radio").change(
                                          function () {
                                              jQuery(this)
                                                  .closest(".swatch")
                                                  .attr("data-option-index");
                                              var t = jQuery(this).val();
                                              jQuery(this)
                                                  .parents("fieldset")
                                                  .find(".variant_current")
                                                  .text(t);
                                          }
                                      ),
                                      $(document).on(
                                          "click",
                                          "#content_quickview .soldout",
                                          function () {
                                              $(
                                                  "#content_quickview .zmdi-close"
                                              ).trigger("click");
                                          }
                                      );
                              },
                              close: function () {
                                  $("#content_quickview").empty(),
                                      $("body").removeClass(
                                          "open_gl_quick_view"
                                      ),
                                      $("body").removeClass(
                                          "cart_popup_opened"
                                      ),
                                      $("body").removeClass(
                                          "open_quick_variants"
                                      ),
                                      $("body").find(".tooltip").remove();
                              },
                          },
                      });
                  },
                  complete: function () {
                      Shopify.PaymentButton.init();
                  },
              }).done(function () {
                  a.removeClass("btn-loading"),
                      $("body").removeClass("loading"),
                      $("body").find(".tooltip").remove();
              });
              let i = this.getAttribute("data-product-url");
              fetch(i)
                  .then((t) => t.text())
                  .then((t) => {
                      let a = new DOMParser().parseFromString(t, "text/html"),
                          i = a
                              .querySelector(".product-template__container")
                              .getAttribute("data-section-id"),
                          e = document.getElementById("content_quickview");
                      e
                          .querySelector("variant-radios")
                          .setAttribute("data-section", i),
                          e
                              .querySelector(".product-template__container")
                              .setAttribute("data-section-id", i),
                          (e.querySelector(
                              ".product-template__container"
                          ).id = "ProductSection-" + i),
                          (e.querySelector("#ProductPrice-templateQV").id =
                              "ProductPrice-" + i),
                          e.querySelector("#ComparePrice-templateQV") &&
                              (e.querySelector(
                                  "#ComparePrice-templateQV"
                              ).id = "ComparePrice-" + i),
                          (e.querySelector("form").id = "product-form-" + i),
                          e
                              .querySelector("form")
                              .setAttribute("data-section", i),
                          (item = e.querySelectorAll(".item_img"));
                      for (var n = 0; n < item.length; n++)
                          (mediaId = item[n].getAttribute("data-media-id")),
                              item[n].setAttribute(
                                  "data-media-id",
                                  i + mediaId
                              );
                      input = e.querySelectorAll("input[type=radio]");
                      for (var n = 0; n < input.length; n++)
                          input[n].setAttribute("form", i);
                  });
          });
      },
      ajaxRemoveFromCart: function () {
          $("#cart-info").on("click", ".remove-from-cart", function (t) {
              t.preventDefault();
              var a = $(this).attr("data-product-id");
              $.ajax({
                  type: "POST",
                  url: "/cart/change.js",
                  data: "quantity=0&id=" + a,
                  dataType: "json",
                  success: function (t) {
                      $("body").hasClass("template-cart")
                          ? window.location.reload()
                          : nuranium.initMiniCart();
                  },
              });
          });
      },
      changeQuantityMiniCart: function () {
          function t(t, a) {
              $.ajax({
                  type: "POST",
                  url: "/cart/change.js",
                  data: "quantity=" + a + "&id=" + t,
                  dataType: "json",
                  success: function (t) {
                      jQuery
                          .get("/cart?view=up_ajax", function (t) {
                              t = jQuery(t);
                              var a = jQuery(t),
                                  i = jQuery(a.get(0)).html(),
                                  e = jQuery(a.get(2)).html();
                              (t_total = $("#cart-info").find(".subtotal")),
                                  $("#cart-info")
                                      .find(".subtotal span")
                                      .html(i),
                                  $(
                                      "#threshold_bar_popup_minicart .cart_threshold"
                                  ).html(e);
                          })
                          .always(function () {
                              Currency.convertAll(
                                  shopCurrency,
                                  $("#currencies span.selected").attr(
                                      "data-currency"
                                  )
                              );
                          }),
                          $.get("/cart?view=json", function (t) {
                              $("#cart-info").html(t);
                          }).always(function () {
                              Currency.convertAll(
                                  shopCurrency,
                                  $("#currencies span.selected").attr(
                                      "data-currency"
                                  )
                              ),
                                  nuranium.updateMiniCart();
                          });
                  },
              });
          }
          $(document).on("click", ".cart__mini-qty", function (a) {
              a.preventDefault();
              var i = $(this),
                  e = i.siblings(".cart__mini-qty--input"),
                  n = e.attr("data-id"),
                  o = parseFloat(e.val()),
                  s = parseFloat(e.attr("step")),
                  r = parseFloat(e.attr("min")),
                  d = parseFloat(e.attr("max"));
              if (i.hasClass("cart__mini-qty--plus")) {
                  var c = o + s;
                  if (c > d && d > 0) {
                      e.val(d);
                      return;
                  }
                  e.val(c);
              } else if (i.hasClass("cart__mini-qty--minus")) {
                  var c = o - s;
                  if (0 === c) {
                      var l = parseInt(e.attr("value"));
                      e.val(l),
                          i
                              .parents(".ajaxcart__product")
                              .find(".remove-from-cart")
                              .trigger("click");
                      return;
                  }
                  if (c < r) return;
                  if (o < 0) {
                      alert("Invalid");
                      return;
                  } else e.val(c);
              }
              t(n, c);
          }),
              $(document).on(
                  "change",
                  ".cart__mini-qty--input",
                  function (a) {
                      var i = $(this),
                          e = parseFloat(i.val()),
                          n = i.attr("data-id"),
                          o =
                              (parseFloat(i.attr("min")),
                              parseFloat(i.attr("max")));
                      if (e > o && o > 0) {
                          e.val(o);
                          return;
                      }
                      if (0 === e) {
                          i.parents(".ajaxcart__product")
                              .find(".remove-from-cart")
                              .trigger("click");
                          return;
                      }
                      t(n, e);
                  }
              );
      },
      changeQuantityPageCart: function () {
          function t(t, a, i) {
              var e = {
                  type: "POST",
                  url: "/cart/change.js",
                  data: "quantity=" + a + "&line=" + t,
                  dataType: "json",
                  success: function (t) {
                      "function" == typeof i && i(t);
                  },
                  error: function (t, a) {},
              };
              jQuery.ajax(e);
          }
          $(document).on(
              "change keyup",
              ".cart__qty-input, .cart__popup-qty--input",
              function () {
                  var a = $(this),
                      i = a.data("line"),
                      e = parseInt(a.val()),
                      n = a.data("price"),
                      o = a.attr("max");
                  if (isNaN(e)) return 0;
                  (o = isNaN(parseInt(o)) ? 9999 : parseInt(o)),
                      e > o && a.attr("value", o).val(o),
                      (e = e > o ? o : e) <= 0 && a.closest("tr").remove(),
                      t(i, e, function (t) {
                          $(".cart__subtotal").html(
                              Shopify.formatMoney(
                                  t.total_price,
                                  theme.moneyFormat
                              )
                          ),
                              a
                                  .parents(".cart_item")
                                  .find(".product-subtotal")
                                  .html(
                                      Shopify.formatMoney(
                                          n * e,
                                          theme.moneyFormat
                                      )
                                  ),
                              $("#CartCount, #CartCountCavas").html(
                                  t.item_count
                              ),
                              $(".cart__heading span").html(
                                  "There are " +
                                      t.item_count +
                                      " items in your cart"
                              ),
                              Currency.convertAll(
                                  shopCurrency,
                                  $("#currencies span.selected").attr(
                                      "data-currency"
                                  )
                              ),
                              jQuery.get("/cart?view=ship", function (t) {
                                  $("#threshold_bar_popup").html(t),
                                      setTimeout(function () {
                                          Currency.convertAll(
                                              shopCurrency,
                                              $(
                                                  "#currencies span.selected"
                                              ).attr("data-currency")
                                          );
                                      }, 200);
                              }),
                              $.get("/cart?view=json", function (t) {
                                  $("#cart-info").html(t);
                              }).always(function () {
                                  Currency.convertAll(
                                      shopCurrency,
                                      $("#currencies span.selected").attr(
                                          "data-currency"
                                      )
                                  ),
                                      nuranium.updateMiniCart();
                              });
                      });
              }
          ),
              $(document).on("click", ".plus, .minus", function () {
                  var t = $(this)
                          .closest(".cart__qty")
                          .find(".cart__qty-input"),
                      a = parseFloat(t.val()),
                      i = parseFloat(t.attr("max")),
                      e = parseFloat(t.attr("min")),
                      n = t.attr("step");
                  (a && "" !== a && "NaN" !== a) || (a = 0),
                      ("" === i || "NaN" === i) && (i = ""),
                      ("" === e || "NaN" === e) && (e = 0),
                      ("any" === n ||
                          "" === n ||
                          void 0 === n ||
                          "NaN" === parseFloat(n)) &&
                          (n = 1),
                      $(this).is(".plus")
                          ? i && a >= i
                              ? t.val(i)
                              : t.val(a + parseFloat(n))
                          : e && a <= e
                          ? t.val(e)
                          : a > 0 && t.val(a - parseFloat(n)),
                      t.trigger("change");
              }),
              $(document).on(
                  "click",
                  ".quick_view-qty-plus, .quick_view-qty-minus",
                  function () {
                      var t = $(this)
                              .closest(".quick_view_qty")
                              .find('input[name="quantity"]'),
                          a = parseFloat(t.val()),
                          i = parseFloat(t.attr("max")),
                          e = parseFloat(t.attr("min")),
                          n = t.attr("step");
                      (a && "" !== a && "NaN" !== a) || (a = 0),
                          ("" === i || "NaN" === i) && (i = ""),
                          ("" === e || "NaN" === e) && (e = 0),
                          ("any" === n ||
                              "" === n ||
                              void 0 === n ||
                              "NaN" === parseFloat(n)) &&
                              (n = 1),
                          $(this).is(".quick_view-qty-plus")
                              ? i && a >= i
                                  ? t.val(i)
                                  : t.val(a + parseFloat(n))
                              : e && a <= e
                              ? t.val(e)
                              : a > 0 && t.val(a - parseFloat(n));
                  }
              );
      },
      initCartExtend: function () {
          jQuery.get("/cart?view=extend", function (t) {
              $(".block_cart_top").before(t);
          }),
              setTimeout(function () {
                  if ($("#shipping-calculator").length > 0) {
                      var _config,
                          _render,
                          _enableButtons,
                          _disableButtons,
                          _getCartShippingRatesForDestination,
                          _pollForCartShippingRatesForDestination,
                          _fullMessagesFromErrors,
                          _onError,
                          _onCartShippingRatesUpdate,
                          _formatRate;
                      "object" == typeof Countries &&
                          (Countries.updateProvinceLabel = function (t, a) {
                              if (
                                  "string" == typeof t &&
                                  Countries[t] &&
                                  Countries[t].provinces &&
                                  ("object" == typeof a ||
                                      null !==
                                          (a = document.getElementById(
                                              "address_province_label"
                                          )))
                              ) {
                                  a.innerHTML = Countries[t].label;
                                  var i = jQuery(a).parent();
                                  i.find("select"),
                                      i
                                          .find(
                                              ".custom-style-select-box-inner"
                                          )
                                          .html(Countries[t].provinces[0]);
                              }
                          }),
                          void 0 === Shopify.Cart && (Shopify.Cart = {}),
                          (Shopify.Cart.ShippingCalculator =
                              ((_config = {
                                  submitButton: "Calculate shipping",
                                  submitButtonDisabled: "Calculating...",
                                  templateId:
                                      "shipping-calculator-response-template",
                                  wrapperId: "wrapper-response",
                                  customerIsLoggedIn: !1,
                                  moneyFormat: "${{amount}}",
                              }),
                              (_render = function (t) {
                                  var a = jQuery("#" + _config.templateId),
                                      i = jQuery("#" + _config.wrapperId);
                                  if (a.length && i.length) {
                                      var e = Handlebars.compile(
                                          jQuery.trim(a.text())
                                      )(t);
                                      if (
                                          (jQuery(e).appendTo(i),
                                          "undefined" != typeof Currency &&
                                              "function" ==
                                                  typeof Currency.convertAll)
                                      ) {
                                          var n = "";
                                          jQuery("[name=currencies]").length >
                                          0
                                              ? (n = jQuery(
                                                    "[name=currencies]"
                                                ).val())
                                              : jQuery(
                                                    "#currencies span.selected"
                                                ).length > 0 &&
                                                (n = jQuery(
                                                    "#currencies span.selected"
                                                ).attr("data-currency")),
                                              "" !== n &&
                                                  Currency.convertAll(
                                                      shopCurrency,
                                                      n,
                                                      "#wrapper-response span.money, #estimated-shipping span.money"
                                                  );
                                      }
                                  }
                              }),
                              (_enableButtons = function () {
                                  jQuery(".get-rates")
                                      .removeAttr("disabled")
                                      .removeClass("disabled")
                                      .val(_config.submitButton);
                              }),
                              (_disableButtons = function () {
                                  jQuery(".get-rates")
                                      .val(_config.submitButtonDisabled)
                                      .attr("disabled", "disabled")
                                      .addClass("disabled");
                              }),
                              (_getCartShippingRatesForDestination = function (
                                  t
                              ) {
                                  var a = {
                                      type: "POST",
                                      url: "/cart/prepare_shipping_rates",
                                      data: jQuery.param({
                                          shipping_address: t,
                                      }),
                                      success: _pollForCartShippingRatesForDestination(
                                          t
                                      ),
                                      error: _onError,
                                  };
                                  jQuery.ajax(a);
                              }),
                              (_pollForCartShippingRatesForDestination = function (
                                  t
                              ) {
                                  var a = function () {
                                      jQuery.ajax(
                                          "/cart/async_shipping_rates",
                                          {
                                              dataType: "json",
                                              success: function (i, e, n) {
                                                  200 === n.status
                                                      ? _onCartShippingRatesUpdate(
                                                            i.shipping_rates,
                                                            t
                                                        )
                                                      : setTimeout(a, 500);
                                              },
                                              error: _onError,
                                          }
                                      );
                                  };
                                  return a;
                              }),
                              (_fullMessagesFromErrors = function (t) {
                                  var a = [];
                                  return (
                                      jQuery.each(t, function (t, i) {
                                          jQuery.each(i, function (i, e) {
                                              a.push(t + " " + e);
                                          });
                                      }),
                                      a
                                  );
                              }),
                              (_onError = function (
                                  XMLHttpRequest,
                                  textStatus
                              ) {
                                  jQuery("#estimated-shipping").hide(),
                                      jQuery(
                                          "#estimated-shipping em"
                                      ).empty(),
                                      _enableButtons();
                                  var feedback = "",
                                      data = eval(
                                          "(" +
                                              XMLHttpRequest.responseText +
                                              ")"
                                      );
                                  "Error : country is not supported." ==
                                      (feedback = data.message
                                          ? data.message +
                                            "(" +
                                            data.status +
                                            "): " +
                                            data.description
                                          : "Error : " +
                                            _fullMessagesFromErrors(
                                                data
                                            ).join("; ") +
                                            ".") &&
                                      (feedback =
                                          "We do not ship to this destination."),
                                      _render({
                                          rates: [],
                                          errorFeedback: feedback,
                                          success: !1,
                                      }),
                                      jQuery("#" + _config.wrapperId).show();
                              }),
                              (_onCartShippingRatesUpdate = function (t, a) {
                                  _enableButtons();
                                  var i = "";
                                  if (
                                      (a.zip && (i += a.zip + ", "),
                                      a.province && (i += a.province + ", "),
                                      (i += a.country),
                                      t.length)
                                  ) {
                                      "0.00" == t[0].price
                                          ? jQuery(
                                                "#estimated-shipping em"
                                            ).html("FREE")
                                          : jQuery(
                                                "#estimated-shipping em"
                                            ).html(_formatRate(t[0].price));
                                      for (var e = 0; e < t.length; e++)
                                          t[e].price = _formatRate(
                                              t[e].price
                                          );
                                  }
                                  _render({
                                      rates: t,
                                      address: i,
                                      success: !0,
                                  }),
                                      jQuery(
                                          "#" +
                                              _config.wrapperId +
                                              ", #estimated-shipping"
                                      ).fadeIn();
                              }),
                              (_formatRate = function (t) {
                                  function a(t, a) {
                                      return void 0 === t ? a : t;
                                  }
                                  function i(t, i, e, n) {
                                      if (
                                          ((i = a(i, 2)),
                                          (e = a(e, ",")),
                                          (n = a(n, ".")),
                                          isNaN(t) || null == t)
                                      )
                                          return 0;
                                      var o,
                                          s = (t = (t / 100).toFixed(
                                              i
                                          )).split(".");
                                      return (
                                          s[0].replace(
                                              /(\d)(?=(\d\d\d)+(?!\d))/g,
                                              "$1" + e
                                          ) + (s[1] ? n + s[1] : "")
                                      );
                                  }
                                  if (
                                      "function" == typeof Shopify.formatMoney
                                  )
                                      return Shopify.formatMoney(
                                          t,
                                          _config.moneyFormat
                                      );
                                  "string" == typeof t &&
                                      (t = t.replace(".", ""));
                                  var e = "",
                                      n = /\{\{\s*(\w+)\s*\}\}/,
                                      o = _config.moneyFormat;
                                  switch (o.match(n)[1]) {
                                      case "amount":
                                          e = i(t, 2);
                                          break;
                                      case "amount_no_decimals":
                                          e = i(t, 0);
                                          break;
                                      case "amount_with_comma_separator":
                                          e = i(t, 2, ".", ",");
                                          break;
                                      case "amount_no_decimals_with_comma_separator":
                                          e = i(t, 0, ".", ",");
                                  }
                                  return o.replace(n, e);
                              }),
                              (_init = function () {
                                  new Shopify.CountryProvinceSelector(
                                      "address_country",
                                      "address_province",
                                      {
                                          hideElement:
                                              "address_province_container",
                                      }
                                  );
                                  var t = jQuery("#address_country"),
                                      a = jQuery(
                                          "#address_province_label"
                                      ).get(0);
                                  "undefined" != typeof Countries &&
                                      (Countries.updateProvinceLabel(
                                          t.val(),
                                          a
                                      ),
                                      t.change(function () {
                                          Countries.updateProvinceLabel(
                                              t.val(),
                                              a
                                          );
                                      })),
                                      jQuery(".get-rates").click(function () {
                                          _disableButtons(),
                                              jQuery("#" + _config.wrapperId)
                                                  .empty()
                                                  .hide();
                                          var t = {};
                                          (t.zip =
                                              jQuery("#address_zip").val() ||
                                              ""),
                                              (t.country =
                                                  jQuery(
                                                      "#address_country"
                                                  ).val() || ""),
                                              (t.province =
                                                  jQuery(
                                                      "#address_province"
                                                  ).val() || ""),
                                              _getCartShippingRatesForDestination(
                                                  t
                                              );
                                      }),
                                      _config.customerIsLoggedIn &&
                                          jQuery(".get-rates:eq(0)").trigger(
                                              "click"
                                          );
                              }),
                              {
                                  show: function (t) {
                                      (t = t || {}),
                                          jQuery.extend(_config, t),
                                          jQuery(function () {
                                              _init();
                                          });
                                  },
                                  getConfig: function () {
                                      return _config;
                                  },
                                  formatRate: function (t) {
                                      return _formatRate(t);
                                  },
                              })),
                          Shopify.Cart.ShippingCalculator.show({
                              submitButton:
                                  theme.strings.shippingCalcSubmitButton,
                              submitButtonDisabled:
                                  theme.strings
                                      .shippingCalcSubmitButtonDisabled,
                              customerIsLoggedIn:
                                  theme.strings
                                      .shippingCalcCustomerIsLoggedIn,
                              moneyFormat:
                                  theme.strings.shippingCalcMoneyFormat,
                          });
                  }
              }, 1e3);
      },
  };
})(jQuery);
