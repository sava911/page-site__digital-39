// search form 
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

    get width () {
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
  /*tags logic*/
  const LArrow = document.querySelector('.tags-linewrapper-leftarrow'), RArrow = document.querySelector('.tags-linewrapper-rightarrow');
  const LineWrapper = document.querySelector('.tags-linewrapper:first-child'), Line = document.querySelector('.tags-linewrapper:first-child .tags-line');
  let TagsOffset = 0;

  function checkArrows(offset, end = Line.querySelector('li:last-child').getBoundingClientRect().right) {
    if (offset == 0) LArrow.classList.add('tags-linewrapper-leftarrow_hidden');
    else LArrow.classList.remove('tags-linewrapper-leftarrow_hidden');
    if (end > LineWrapper.getBoundingClientRect().right) RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
    else RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
  }

  checkArrows(0);

  function findEdges() {
    const padding = parseFloat(getComputedStyle(LineWrapper.querySelector('.tags-linewrapper-content')).getPropertyValue('padding-left'));
    let Ledge = LineWrapper.getBoundingClientRect().left + padding;
    let Redge = LineWrapper.getBoundingClientRect().right - padding;
    let l = undefined, r = 0, falseL = 0;

    for (let i = 0; i < Line.children.length; i++) {
      let item = Line.children[i];
      if (item.classList.contains('tags-line-item_selected')) continue;
      if (item.getBoundingClientRect().left >= Ledge) { l = i; Ledge = Infinity; }
      if (item.getBoundingClientRect().right <= Redge) r = i;
      falseL = i;
    }

    if (l == undefined) l = falseL;
    if (false == undefined) TagsOffset = 0;
    Ledge = LineWrapper.getBoundingClientRect().left + padding;

    let firstRight = undefined, firstLeft = undefined, secondLeft = undefined, secondRight = undefined;
    for (let i = r + 1; i < Line.children.length; i++) {
      let item = Line.children[i];
      if (!item.classList.contains('tags-line-item_selected')) {
        if (!firstRight) {
          firstRight = item;
          if (firstRight.getBoundingClientRect().right - Redge < 3) {
            firstRight = undefined;
          }
          continue
        }
        secondRight = item;
        break;
      }
    }

    for (let i = (l == falseL) ? l : l - 1; i >= 0; i--) {
      let item = Line.children[i];
      if (!item.classList.contains('tags-line-item_selected')) {
        if (!firstLeft) {
          firstLeft = item;
          if (Ledge - firstLeft.getBoundingClientRect().left < 3) {
            firstLeft = undefined;
          }
          continue;
        }
        secondLeft = item
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
    }
  }

  RArrow.onclick = function () {
    let data = findEdges();
    if (data.RightOffset) {
      TagsOffset -= data.RightOffset;
      Line.style.transform = "translateX(" + TagsOffset + 'px)';
      if (TagsOffset < 0) LArrow.classList.remove('tags-linewrapper-leftarrow_hidden');
    }
    if (data.rightWillEnd || data.RightOffset == undefined) RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
  }

  LArrow.onclick = function () {
    let data = findEdges();
    if (data.LeftOffset) {
      if (data.RightOffset || data.LeftOffset > data.AllowRightOffset) RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
      TagsOffset += data.LeftOffset;
      Line.style.transform = "translateX(" + TagsOffset + 'px)';
    }

    if (data.leftWillEnd) LArrow.classList.add('tags-linewrapper-leftarrow_hidden');
  }

  window.onresize = function () {
    let data = findEdges();
    if (data.RightOffset == undefined || data.rightEnd) RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
    else RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
    scratchFooterTags();
  }

  document.querySelectorAll('.tags-linewrapper:first-child li').forEach((item) => item.onclick = function () {
    this.classList.add('tags-line-item_selected');
    let a = this.cloneNode(true);
    this.style.marginRight = "-" + (this.offsetWidth) + "px";
    a.onclick = undefined;
    a.querySelector('button').onclick = () => {
      this.style.marginRight = null;
      this.classList.remove('tags-line-item_selected');
      a.classList.remove('tags-line-item_selected');
      a.style.marginRight = "-" + (a.offsetWidth) + "px";
      setTimeout(() => {
        a.remove();
        let data = findEdges();
        if (data.RightOffset == undefined) RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
        else RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
        if (data.leftEnd) LArrow.classList.add('tags-linewrapper-leftarrow_hidden');
        else LArrow.classList.remove('tags-linewrapper-leftarrow_hidden');
      }
        , 500);
    };
    document.querySelector('.tags-linewrapper:last-child .tags-line').appendChild(a);
    setTimeout(() => {
      let data = findEdges();
      if (data.RightOffset == undefined) RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
      else RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
      if (data.leftEnd) LArrow.classList.add('tags-linewrapper-leftarrow_hidden');
      else LArrow.classList.remove('tags-linewrapper-leftarrow_hidden');
    }
      , 500);
  });

  function scratchFooterTags() {
    let prevHeight;
    document.querySelectorAll('.footerTags-content-item').forEach((item) => {
      item.classList.remove('footerTags-content-item_notfirst');
      let itemHeight = item.getBoundingClientRect().bottom;
      if (prevHeight == undefined) {
        prevHeight = itemHeight;
      }
      else {
        if (itemHeight == prevHeight) {
          item.classList.add('footerTags-content-item_notfirst');
        }
        else {
          prevHeight = itemHeight;
        }
      }

    });
  }

  window.onload = function(){
    scratchFooterTags();
  };


// button to top
(function() {
  'use strict';

  function trackScroll() {
    var scrolled = window.pageYOffset;
    var coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      goTopBtn.classList.add('up-button_display');
    }
    if (scrolled < coords) {
      goTopBtn.classList.remove('up-button_display');
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }

  var goTopBtn = document.querySelector('.up-button');

  window.addEventListener('scroll', trackScroll);
  goTopBtn.addEventListener('click', backToTop);
})();


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL2pzL3V0aWxzLmpzIiwiLi4vLi4vLi4vYXBwL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCAkID0gKHNlbGVjdG9yKSA9PiB7XG4gIGlmIChzZWxlY3RvclswXSA9PT0gJyMnKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGVjdG9yLnN1YnN0cmluZygxKSlcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKVxuICAgIHJldHVybiBlbGVtZW50cy5sZW5ndGggPiAxID8gZWxlbWVudHMgOiBlbGVtZW50c1swXVxuICB9XG59XG5cbiQuZG9jdW1lbnQgPSB7XG4gIHJlYWR5OiAoY2FsbGJhY2spID0+IHtcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuJC53aW5kb3cgPSB7XG4gIHJlc2l6ZTogKGNhbGxiYWNrKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xuICAgICAgICBjYWxsYmFjayhldmVudClcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIGdldCB3aWR0aCAoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxuICB9XG59XG5cbmV4cG9ydCB7ICQgfVxuIiwiaW1wb3J0IHsgJCB9IGZyb20gJy4uL3V0aWxzJ1xuXG5jb25zdCBoYW5kbGVSZXNpemUgPSAoKSA9PiB7XG4gIC8vIGNvbnNvbGUubG9nKCQud2luZG93LndpZHRoKVxufVxuXG4kLmRvY3VtZW50LnJlYWR5KCgpID0+IHtcbiAgY29uc3QgJG5hdmlnYXRpb25TZWFyY2ggPSAkKCcubmF2aWdhdGlvbi1zZWFyY2gnKVxuICBjb25zdCAkbmF2aWdhdGlvblNlYXJjaEJ1dHRvbiA9ICQoJy5uYXZpZ2F0aW9uLXNlYXJjaC1idXR0b24nKVxuICBjb25zdCAkbmF2aWdhdGlvblNlYXJjaEZvcm0gPSAkKCcubmF2aWdhdGlvbi1zZWFyY2gtZm9ybScpXG4gIGNvbnN0ICRuYXZpZ2F0aW9uU2VhcmNoSW5wdXQgPSAkKCcubmF2aWdhdGlvbi1zZWFyY2gtaW5wdXQnKVxuXG4gIC8vIFNldCBmb2N1cyBvbiBzZWFyY2ggaW5wdXQgb24gZm9ybSByZXNldHRpbmcuXG4gICRuYXZpZ2F0aW9uU2VhcmNoRm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsICgpID0+IHtcbiAgICAkbmF2aWdhdGlvblNlYXJjaElucHV0LmZvY3VzKClcbiAgfSlcblxuICAkbmF2aWdhdGlvblNlYXJjaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAvLyBTZXQgZm9jdXMgb24gc2VhcmNoIGlucHV0IG9uIG9wZW5pbmcgc2VhcmNoIHBhbmVsLlxuICAgIGlmICghJG5hdmlnYXRpb25TZWFyY2guY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1hY3RpdmUnKSkge1xuICAgICAgJG5hdmlnYXRpb25TZWFyY2hJbnB1dC5mb2N1cygpXG4gICAgfVxuICAgICRuYXZpZ2F0aW9uU2VhcmNoLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpXG4gIH0pXG5cbiAgJC53aW5kb3cucmVzaXplKCgpID0+IHtcbiAgICBjbGVhclRpbWVvdXQoaGFuZGxlUmVzaXplLnRpbWVyKVxuICAgIGhhbmRsZVJlc2l6ZS50aW1lciA9IHNldFRpbWVvdXQoaGFuZGxlUmVzaXplLCA1MDApXG4gIH0pXG59KVxuIl0sIm5hbWVzIjpbImNvbnN0Il0sIm1hcHBpbmdzIjoiOzs7RUFBQUEsSUFBTSxDQUFDLGFBQUksUUFBUSxFQUFLO0VBQ3hCLEVBQUUsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO0VBQzNCLElBQUksT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekQsR0FBRyxNQUFNO0VBQ1QsSUFBSUEsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBQztFQUNwRixJQUFJLE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7RUFDdkQsR0FBRztFQUNILEVBQUM7QUFDRDtFQUNBLENBQUMsQ0FBQyxRQUFRLEdBQUc7RUFDYixFQUFFLEtBQUssWUFBRyxRQUFRLEVBQUs7RUFDdkIsSUFBSSxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtFQUN4QyxNQUFNLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsWUFBRyxLQUFLLEVBQUs7RUFDL0QsUUFBUSxRQUFRLENBQUMsS0FBSyxFQUFDO0VBQ3ZCLE9BQU8sRUFBQztFQUNSLEtBQUs7RUFDTCxHQUFHO0VBQ0gsRUFBQztBQUNEO0VBQ0EsQ0FBQyxDQUFDLE1BQU0sR0FBRztFQUNYLEVBQUUsTUFBTSxZQUFHLFFBQVEsRUFBSztFQUN4QixJQUFJLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO0VBQ3hDLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsWUFBRyxLQUFLLEVBQUs7RUFDbkQsUUFBUSxRQUFRLENBQUMsS0FBSyxFQUFDO0VBQ3ZCLE9BQU8sRUFBQztFQUNSLEtBQUs7RUFDTCxHQUFHO0FBQ0g7RUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUc7RUFDZixJQUFJLE9BQU8sUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXO0VBQy9DLEdBQUc7RUFDSDs7RUM3QkFBLElBQU0sWUFBWSxlQUFTO0VBQzNCO0VBQ0EsRUFBQztBQUNEO0VBQ0EsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLGFBQU87RUFDdkIsRUFBRUEsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUMsb0JBQW9CLEVBQUM7RUFDbkQsRUFBRUEsSUFBTSx1QkFBdUIsR0FBRyxDQUFDLENBQUMsMkJBQTJCLEVBQUM7RUFDaEUsRUFBRUEsSUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUMseUJBQXlCLEVBQUM7RUFDNUQsRUFBRUEsSUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUMsMEJBQTBCLEVBQUM7QUFDOUQ7RUFDQTtFQUNBLEVBQUUscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxjQUFRO0VBQ3hELElBQUksc0JBQXNCLENBQUMsS0FBSyxHQUFFO0VBQ2xDLEdBQUcsRUFBQztBQUNKO0VBQ0EsRUFBRSx1QkFBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLGNBQVE7RUFDMUQ7RUFDQSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0VBQzVELE1BQU0sc0JBQXNCLENBQUMsS0FBSyxHQUFFO0VBQ3BDLEtBQUs7RUFDTCxJQUFJLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFDO0VBQ25ELEdBQUcsRUFBQztBQUNKO0VBQ0EsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sYUFBTztFQUN4QixJQUFJLFlBQVksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFDO0VBQ3BDLElBQUksWUFBWSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBQztFQUN0RCxHQUFHLEVBQUM7RUFDSixDQUFDOzs7OyJ9
