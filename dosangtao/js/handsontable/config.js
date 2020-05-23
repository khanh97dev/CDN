if(customHandsontable == undefined){
  var customHandsontable = {
    init: function({element = '#hot', windowEl = '$hot'}, config = {}) {
      let el = $(element);
      let getConfig = Object.assign(this.config, config);
      el.handsontable(getConfig);
      window[windowEl] = el.handsontable('getInstance');
    },
    config: {
      data: [],
      width: '100%',
      height: 600,
      comments: false,
      rowHeights: 35,
      columnHeaderHeight: 35,
      colHeaders: true,
      rowHeaders: true,
      headerTooltips: true,
      manualRowResize: true,
      manualColumnResize: true,
      columnSorting: true,
      currentRowClassName: "currentRow",
      outsideClickDeselects: false,
      filters: true,
      readOnly: true,
      dropdownMenu: ['filter_by_value', 'filter_action_bar'],
      contextMenu: {
        items: {
          custom_remove_row: {
            name: '<b class="text-danger">Xóa hàng</b>',
            callback: function() {
              let selection = this.getSelected();
              selection.forEach(row => {
                if (row[0] === row[2]) {
                  this.alter('remove_row', row[0], 1)
                }
                else if (row[0] > row[2]) {
                  this.alter('remove_row', row[2], (row[0] - row[2]) + 1)
                }
                else if (row[2] > row[0]) {
                  this.alter('remove_row', row[0], (row[2] - row[0]) + 1)
                }
              })
              this.deselectCell();

              $toastSuccess('Xóa thành công')
            }
          },
          '_1': Handsontable.plugins.ContextMenu.SEPARATOR,
          'add_row_one': {
            name: "Thêm 1 hàng",
            callback: function() {
              this.alter("insert_row", this.getSelected()[0] + 1, 1);
            }
          },
          'add_row_five': {
            name: "Thêm 5 hàng",
            callback: function() {
              this.alter("insert_row", this.getSelected()[0] + 1, 5);
            }
          },
          '_3': Handsontable.plugins.ContextMenu.SEPARATOR,
          undo: {
            name: 'Hoàn tác'
          },
          redo: {
            name: 'Làm lại'
          },
          '_4': Handsontable.plugins.ContextMenu.SEPARATOR,
          copy: {
            name: 'Sao chép'
          }
        }
      },
    }
  }
}
var hotSettings = {
  data: [],
  width: '100%',
  contextMenu: {
    items: {
      custom_remove_row: {
        name: '<b class="text-danger">Xóa hàng</b>',
        callback: function() {
          let selection = this.getSelected();
          let data = [];
          selection.forEach(row => {
            if (row[0] === row[2]) {
              data = [this.getSourceDataAtRow(row[0])];
              this.alter('remove_row', row[0], 1)
            }
            else if (row[0] > row[2]) {
              for (var r = row[2]; r <= row[0]; r++) {
                data.push(this.getSourceDataAtRow(r));
              }
              this.alter('remove_row', row[2], (row[0] - row[2]) + 1)
            }
            else if (row[2] > row[0]) {
              for (var r = row[0]; r <= row[2]; r++) {
                data.push(this.getSourceDataAtRow(r));
              }
              this.alter('remove_row', row[0], (row[2] - row[0]) + 1)
            }
          })
          if(window['handleRemoveRow']) {
            handleRemoveRow(data);
          }
          this.deselectCell();
          $toastSuccess('Xóa thành công')
        }
      },
      '_1': Handsontable.plugins.ContextMenu.SEPARATOR,
      'add_row_one': {
        name: "Thêm 1 hàng",
        callback: function() {
          this.alter("insert_row", this.getSelected()[0] + 1, 1);
        }
      },
      'add_row_five': {
        name: "Thêm 5 hàng",
        callback: function() {
          this.alter("insert_row", this.getSelected()[0] + 1, 5);
        }
      },
      '_3': Handsontable.plugins.ContextMenu.SEPARATOR,
      undo: {
        name: 'Hoàn tác'
      },
      redo: {
        name: 'Làm lại'
      },
      '_4': Handsontable.plugins.ContextMenu.SEPARATOR,
      copy: {
        name: 'Sao chép'
      }
    }
  },
  height: 600,

  // fixedColumnsLeft: 0,

  comments: false,

  rowHeights: 35,
  columnHeaderHeight: 35,

  colHeaders: true,
  rowHeaders: true,

  headerTooltips: true,

  manualRowResize: true,
  manualColumnResize: true,

  columnSorting: true,
  currentRowClassName: "currentRow",
  outsideClickDeselects: false,
  filters: true,
  readOnly: true,
  dropdownMenu: ['filter_by_value', 'filter_action_bar'],
  // event //
  beforeChange: (changes) => {
  }
};

function clearFitler() {
  $hot.getPlugin('Filters').clearConditions();
  $hot.getPlugin('Filters').filter();
}

function paginate(array, page_size, page_number) {
  --page_number;
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

//  function render
Handsontable.renderers.registerRenderer('renderLink', function(instance, td, row, col, prop, value, cellProperties) {
  $(td).attr('style', `
    display: table-cell;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    word-break: break-word;
  `)
  var url = value;
  var domain = url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
  return td.innerHTML = `
    <a target="_blank" href="${url}"
      data-toggle="tooltip" data-placement="top" title="${url}"
    >
      ${domain}
    </a>
  `
});

Handsontable.renderers.registerRenderer('renderLinkNCC', function(instance, td, row, col, prop, value, cellProperties) {
  if (value && value.length > 1) {
    $(td).attr('style', `
      display: table-cell;
      width: 100%;
      height: 100%;
      white-space: nowrap;
      word-break: break-word;
    `);
    var array = value.split('\n');
    if (array.length === 1) return td.textContent = array[0];
    var text = array[0];
    var url = value.match(/http.*/g) ? value.match(/http.*/g)[0] : '';

    var titles = array.filter((item, index) => index > 1);
    var title = titles.join('\n');
    var style = '';
    if (array.length > 2) {
      style = 'border-bottom: 2px solid;';
      mapPopover();
    }
    td.innerHTML = `
      <a href="${url}"
        ${titles.length
          ? `
            data-trigger="hover"
            title="comment"
            data-content="${title}"
          `
          : ''
        }
        style="${style}"
        target="_blank"
        data-toggle="popover"
      >
        ${text}
      </a>
    `
  } else td.textContent = value
});

Handsontable.renderers.registerRenderer('gocVaNhap', function(instance, td, row, col, prop, value, cellProperties) {
  let giaGoc = value;
  let giaNhap = instance.getDataAtCell(row, (col + 1));
  return td.innerHTML = `${giaGoc} (${giaNhap})`;
});

class CustomEditor extends Handsontable.editors.AutocompleteEditor {
  init() {
    // Create detached node, add CSS class and make sure its not visible
    this.select = this.hot.rootDocument.createElement('SELECT');
    Handsontable.dom.addClass(this.select, 'htSelectEditor');
    this.select.style.display = 'none';

    // Attach node to DOM, by appending it to the container holding the table
    this.hot.rootElement.appendChild(this.select);
  }

  constructor(props) {
    super(props);
  }

  createElements() {
    super.createElements();

    this.TEXTAREA = document.createElement('input');
    this.TEXTAREA.setAttribute('placeholder', '...');
    this.TEXTAREA.className = 'handsontableInput textarea-custom';
    this.textareaStyle = this.TEXTAREA.style;
    Handsontable.dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }

  onBeforeKeyDown() {
    const previousOptionIndex = this.select.selectedIndex - 1;
    const nextOptionIndex = this.select.selectedIndex + 1;

    switch (event.keyCode) {
      case Handsontable.helper.KEY_CODES.ARROW_UP:
        if (previousOptionIndex >= 0) {
          this.select[previousOptionIndex].selected = true;
        }

        stopImmediatePropagation(event);
        event.preventDefault();
        break;

      case Handsontable.helper.KEY_CODES.ARROW_DOWN:
        if (nextOptionIndex <= this.select.length - 1) {
          this.select[nextOptionIndex].selected = true;
        }

        stopImmediatePropagation(event);
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  prepare(row, col, prop, td, originalValue, cellProperties) {
    // Remember to invoke parent's method
    super.prepare(row, col, prop, td, originalValue, cellProperties);

    const selectOptions = this.cellProperties.selectOptions;
    let options;

    if (typeof selectOptions === 'function') {
      options = this.prepareOptions(selectOptions(this.row, this.col, this.prop));
    } else {
      options = this.prepareOptions(selectOptions);
    }

    Handsontable.dom.empty(this.select);

    Handsontable.helper.objectEach(options, (value, key) => {
      const optionElement = this.hot.rootDocument.createElement('OPTION');
      optionElement.value = key;

      Handsontable.dom.fastInnerHTML(optionElement, value);
      this.select.appendChild(optionElement);
    });
  }

  prepareOptions(optionsToPrepare) {
    let preparedOptions = {};

    if (Array.isArray(optionsToPrepare)) {
      for (let i = 0, len = optionsToPrepare.length; i < len; i++) {
        preparedOptions[optionsToPrepare[i]] = optionsToPrepare[i];
      }

    } else if (typeof optionsToPrepare === 'object') {
      preparedOptions = optionsToPrepare;
    }

    return preparedOptions;
  }

  open() {
    this._opened = true;
    this.refreshDimensions();
    this.select.style.display = '';
  }

  refreshDimensions() {
    this.TD = this.getEditedCell();

    // TD is outside of the viewport.
    if (!this.TD) {
      this.close();

      return;
    }
    const {
      wtOverlays
    } = this.hot.view.wt;
    const currentOffset = Handsontable.dom.offset(this.TD);
    const containerOffset = Handsontable.dom.offset(this.hot.rootElement);
    const scrollableContainer = wtOverlays.scrollableElement;
    const editorSection = this.checkEditorSection();
    let width = Handsontable.dom.outerWidth(this.TD) + 1;
    let height = Handsontable.dom.outerHeight(this.TD) + 1;
    let editTop = currentOffset.top - containerOffset.top - 1 - (scrollableContainer.scrollTop || 0);
    let editLeft = currentOffset.left - containerOffset.left - 1 - (scrollableContainer.scrollLeft || 0);
    let cssTransformOffset;

    switch (editorSection) {
      case 'top':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.topOverlay.clone.wtTable.holder.parentNode);
        break;
      case 'left':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.leftOverlay.clone.wtTable.holder.parentNode);
        break;
      case 'top-left-corner':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.topLeftCornerOverlay.clone.wtTable.holder.parentNode);
        break;
      case 'bottom-left-corner':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.bottomLeftCornerOverlay.clone.wtTable.holder.parentNode);
        break;
      case 'bottom':
        cssTransformOffset = Handsontable.dom.getCssTransform(wtOverlays.bottomOverlay.clone.wtTable.holder.parentNode);
        break;
      default:
        break;
    }

    if (this.hot.getSelectedLast()[0] === 0) {
      editTop += 1;
    }
    if (this.hot.getSelectedLast()[1] === 0) {
      editLeft += 1;
    }

    const selectStyle = this.select.style;

    if (cssTransformOffset && cssTransformOffset !== -1) {
      selectStyle[cssTransformOffset[0]] = cssTransformOffset[1];
    } else {
      Handsontable.dom.resetCssTransform(this.select);
    }

    const cellComputedStyle = Handsontable.dom.getComputedStyle(this.TD, this.hot.rootWindow);

    if (parseInt(cellComputedStyle.borderTopWidth, 10) > 0) {
      height -= 1;
    }
    if (parseInt(cellComputedStyle.borderLeftWidth, 10) > 0) {
      width -= 1;
    }

    selectStyle.height = `${height}px`;
    selectStyle.minWidth = `${width}px`;
    selectStyle.top = `${editTop}px`;
    selectStyle.left = `${editLeft}px`;
    selectStyle.margin = '0px';
  }

  getEditedCell() {
    const {
      wtOverlays
    } = this.hot.view.wt;
    const editorSection = this.checkEditorSection();
    let editedCell;

    switch (editorSection) {
      case 'top':
        editedCell = wtOverlays.topOverlay.clone.wtTable.getCell({
          row: this.row,
          col: this.col
        });
        this.select.style.zIndex = 101;
        break;
      case 'corner':
        editedCell = wtOverlays.topLeftCornerOverlay.clone.wtTable.getCell({
          row: this.row,
          col: this.col
        });
        this.select.style.zIndex = 103;
        break;
      case 'left':
        editedCell = wtOverlays.leftOverlay.clone.wtTable.getCell({
          row: this.row,
          col: this.col
        });
        this.select.style.zIndex = 102;
        break;
      default:
        editedCell = this.hot.getCell(this.row, this.col);
        this.select.style.zIndex = '';
        break;
    }

    return editedCell < 0 ? void 0 : editedCell;
  }

  focus() {
    this.select.focus();
  }

  close() {
    this._opened = false;
    this.select.style.display = 'none';
  }
}

// handle find dublicate column
let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
// handle comment data
function getComments(comments, currentPage, columns = 0) {
  var currentPage = current_page ? current_page : 1
  for (var row = 0; row < $hot.countRows(); row++) {
    var obj = $hot.getCellMeta(row, columns)
    if (obj.comment) {
      var indexComment = comments.findIndex(item => item.row === obj.row && item.currentPage === currentPage)
      if (comments.length && indexComment > -1) {
        comments[indexComment].comment.value = obj.comment ?
          obj.comment.value :
          ''
      } else {
        comments.push({
          row: row,
          col: columns,
          comment: {
            value: obj.comment.value
          },
          currentPage
        })
      }
    }
  }
  return comments;
}

function clearFilterHot() {
  if ($hot) {
    let filter = $hot.getPlugin('Filters');
    filter.clearConditions();
    filter.filter();
  }
}
