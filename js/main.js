// search
(function () {
  'use strict';

  var $ = function (selector) {
    if (selector[0] === '#') {
      return document.getElementById(selector.substring(1))
    } else {
      var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
      return elements.length > 1 ? elements : elements[0]
    }
  };

  $.document = {
    ready: function (callback) {
      if (typeof callback === 'function') {
        document.addEventListener('DOMContentLoaded', function (event) {
          callback(event);
        });
      }
    }
  };

  $.window = {
    resize: function (callback) {
      if (typeof callback === 'function') {
        window.addEventListener('resize', function (event) {
          callback(event);
        });
      }
    },

    get width() {
      return document.documentElement.clientWidth
    }
  };

  var handleResize = function () {
    // console.log($.window.width)
  };

  $.document.ready(function () {
    var $navigationSearch = $('.navigation-search');
    var $navigationSearchButton = $('.navigation-search-button');
    var $navigationSearchForm = $('.navigation-search-form');
    var $navigationSearchInput = $('.navigation-search-input');

    // Set focus on search input on form resetting.
    $navigationSearchForm.addEventListener('reset', function () {
      $navigationSearchInput.focus();
    });

    $navigationSearchButton.addEventListener('click', function () {
      // Set focus on search input on opening search panel.
      if (!$navigationSearch.classList.contains('is-active')) {
        $navigationSearchInput.focus();
      }
      $navigationSearch.classList.toggle('is-active');
    });

    $.window.resize(function () {
      clearTimeout(handleResize.timer);
      handleResize.timer = setTimeout(handleResize, 500);
    });
  });

}());

//subnav logic
{

  const prev = document.querySelector('.subnavigation__prev');
  const next = document.querySelector('.subnavigation__next');

  const first = document.querySelector('.subnavigation__listitem:first-child');
  const last = document.querySelector('.subnavigation__listitem:last-child');

  let ar = document.querySelectorAll('.subnavigation__listitem:not(.subnavigation__listitem_hidden)');
  let begin = ar[0];
  let end = ar[ar.length = 1];

  function checkNavArrows() {
    if (end == last) next.classList.add('subnavigation__button_disabled')
    else next.classList.remove('subnavigation__button_disabled');

    if (begin == first) prev.classList.add('subnavigation__button_disabled')
    else prev.classList.remove('subnavigation__button_disabled');
  }

  function toRight(Expand, Shrink) {
    if (!Shrink) {
      end.nextElementSibling.classList.remove('subnavigation__listitem_hidden');
      end = end.nextElementSibling;
    }
    if (!Expand) {
      begin.classList.add('subnavigation__listitem_hidden');
      begin = begin.nextElementSibling;
    }
    checkNavArrows();
  }

  function toLeft(Expand, Shrink) {
    if (!Shrink) {
      begin.previousElementSibling.classList.remove('subnavigation__listitem_hidden');
      begin = begin.previousElementSibling;
    }
    if (!Expand) {
      end.classList.add('subnavigation__listitem_hidden');
      end = end.previousElementSibling;
    }
    checkNavArrows();
  }

  next.onclick = function () {
    toRight();
  }

  prev.onclick = function () {
    toLeft();
  }

  let count = 2;
  function checkCount() {
    let mustbe;
    if (window.innerWidth >= 1366) mustbe = 5;
    else if (window.innerWidth > 1024) mustbe = 4;
    else if (window.innerWidth > 768) mustbe = 3;
    else mustbe = 2;
    while (count < mustbe && end != last) { toRight(true); count++; }
    while (count < mustbe && begin != first) { toLeft(true); count++; }
    while (count > mustbe && begin != end) { toLeft(false, true); count--; }
    while (count > mustbe && begin != end) { toRight(false, true); count--; }
  }

  checkCount();

  window.addEventListener('resize', function (event) {
    checkCount();
  });

}

const placeholder = document.querySelector('.video');
var vid;

function getVideoHtml(width, height) {
  return '<iframe width="' + width + '"height="' + height + '" src="https://www.youtube.com/embed/592arVyUtEc?autoplay=1" frameborder="0" allow="accelerometer; autoplay="1"; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}

placeholder.onclick = function (e) {
  document.querySelector('.video__shapecreator').innerHTML = getVideoHtml(placeholder.getBoundingClientRect().width, placeholder.getBoundingClientRect().height);
  vid = document.querySelector('.video__shapecreator iframe');
}



function ibg() {

  let ibg = document.querySelectorAll(".ibg");
  for (var i = 0; i < ibg.length; i++) {
    let img, arr;
    arr = ibg[i].querySelectorAll('.ibg__image');
    for (var j = 0; j < arr.length; j++) {
      if (getComputedStyle(arr[j]).display != "none") {
        img = arr[j];
        break;
      }
    }

    if (img) {
      ibg[i].style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
    }
    else {
      obj = ibg[i].getElementsByClassName('grid__item-icon')[0];

      if (obj) {
        obj.onload = function () {
          let img = this.contentDocument.getElementsByTagName('svg')[0].cloneNode(true);
          img.querySelector('path').setAttribute('fill-opacity', '0.2');
          img.setAttribute('class', "grid__item-bgicon");
          this.parentNode.appendChild(img);
        }
      }
    }
  }
}

ibg();

//tags logic, IE-compatible
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

var LArrow = document.querySelector('.tags-linewrapper-leftarrow'),
  RArrow = document.querySelector('.tags-linewrapper-rightarrow');
var LineWrapper = document.querySelector('.tags-linewrapper:first-child'),
  Line = document.querySelector('.tags-linewrapper:first-child .tags-line');
var TagsOffset = 0;

function checkArrows(offset) {
  var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Line.querySelector('a:last-child').getBoundingClientRect().right;
  if (offset == 0) LArrow.classList.add('tags-linewrapper-leftarrow_hidden'); else LArrow.classList.remove('tags-linewrapper-leftarrow_hidden');
  if (end > LineWrapper.getBoundingClientRect().right) RArrow.classList.remove('tags-linewrapper-rightarrow_hidden'); else RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
}

checkArrows(0);

function findEdges() {
  var padding = parseFloat(getComputedStyle(LineWrapper.querySelector('.tags-linewrapper-content')).getPropertyValue('padding-left'));
  var Ledge = LineWrapper.getBoundingClientRect().left + padding;
  var Redge = LineWrapper.getBoundingClientRect().right - padding;
  var l = undefined,
    r = 0,
    falseL = 0;

  for (var i = 0; i < Line.children.length; i++) {
    var item = Line.children[i];
    if (item.classList.contains('tags-line-item_selected')) continue;

    if (item.getBoundingClientRect().left >= Ledge) {
      l = i;
      Ledge = Infinity;
    }

    if (item.getBoundingClientRect().right <= Redge) r = i;
    falseL = i;
  }

  if (l == undefined) l = falseL;
  if (false == undefined) TagsOffset = 0;
  Ledge = LineWrapper.getBoundingClientRect().left + padding;
  var firstRight = undefined,
    firstLeft = undefined,
    secondLeft = undefined,
    secondRight = undefined;

  for (var _i = r + 1; _i < Line.children.length; _i++) {
    var _item = Line.children[_i];

    if (!_item.classList.contains('tags-line-item_selected')) {
      if (!firstRight) {
        firstRight = _item;

        if (firstRight.getBoundingClientRect().right - Redge < 3) {
          firstRight = undefined;
        }

        continue;
      }

      secondRight = _item;
      break;
    }
  }

  for (var _i2 = l == falseL ? l : l - 1; _i2 >= 0; _i2--) {
    var _item2 = Line.children[_i2];

    if (!_item2.classList.contains('tags-line-item_selected')) {
      if (!firstLeft) {
        firstLeft = _item2;

        if (Ledge - firstLeft.getBoundingClientRect().left < 3) {
          firstLeft = undefined;
        }

        continue;
      }

      secondLeft = _item2;
      break;
    }
  }

  return {
    'Ledge': Line.children[l].getBoundingClientRect().left,
    'Redge': Line.children[r].getBoundingClientRect().right,
    'l': l,
    'r': r,
    'AllowRightOffset': Redge - Line.children[r].getBoundingClientRect().right,
    'RightOffset': firstRight ? firstRight.getBoundingClientRect().right - Redge : undefined,
    'LeftOffset': firstLeft ? Ledge - firstLeft.getBoundingClientRect().left : undefined,
    'rightEnd': firstRight == undefined || Line.children.length == 0 ? true : false,
    'leftEnd': firstLeft == undefined || Line.children.length == 0 ? true : false,
    'leftWillEnd': secondLeft == undefined ? true : false,
    'rightWillEnd': secondRight == undefined ? true : false
  };
}

RArrow.onclick = function () {
  var data = findEdges();

  if (data.RightOffset) {
    TagsOffset -= data.RightOffset;
    Line.style.transform = "translateX(" + TagsOffset + 'px)';
    if (TagsOffset < 0) LArrow.classList.remove('tags-linewrapper-leftarrow_hidden');
  }

  if (data.rightWillEnd || data.RightOffset == undefined) RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
};

LArrow.onclick = function () {
  var data = findEdges();

  if (data.LeftOffset) {
    if (data.RightOffset || data.LeftOffset > data.AllowRightOffset) RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
    TagsOffset += data.LeftOffset;
    Line.style.transform = "translateX(" + TagsOffset + 'px)';
  }

  if (data.leftWillEnd) LArrow.classList.add('tags-linewrapper-leftarrow_hidden');
};

window.onresize = function () {

  if (vid) {
    vid.setAttribute('width', placeholder.getBoundingClientRect().width);
    vid.setAttribute('height', placeholder.getBoundingClientRect().height);
  }

  var data = findEdges();
  if (data.RightOffset == undefined || data.rightEnd) RArrow.classList.add('tags-linewrapper-rightarrow_hidden'); else RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
  scratchFooterTags();
};

(function (arr) {

  arr.forEach(function (item) {

    if (item.hasOwnProperty('remove')) {
      return;
    }

    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      }
    });

  });

})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

function scratchFooterTags() {
  var prevHeight;
  document.querySelectorAll('.footerTags-content-item').forEach(function (item) {
    item.classList.remove('footerTags-content-item_notfirst');
    var itemHeight = item.getBoundingClientRect().bottom;

    if (prevHeight == undefined) {
      prevHeight = itemHeight;
    } else {
      if (itemHeight == prevHeight) {
        item.classList.add('footerTags-content-item_notfirst');
      } else {
        prevHeight = itemHeight;
      }
    }
  });
}

window.onload = function () {
  scratchFooterTags();
};
