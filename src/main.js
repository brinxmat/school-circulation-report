function init () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', getURL(), true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var content = xhr.responseText;
      if (content !== '' && (content)) {
        createDocument(JSON.parse(content));
      } else {
        alert('Wrong' + xhr.error);
      }
    }
  };
  xhr.send(null);
}

function createDocument (data) {
  printWindow = window.open('');
  doc = printWindow.document;
  doc.head.appendChild(getStyle(doc));
  doc.body.appendChild(getButton(doc));
  doc.body.appendChild(getMetadata(doc, data));
  doc.body.appendChild(getScripts(doc, data));
}

function getURL () {

  var path = '';
  (document.location.pathname.match(/\//g) || []).forEach(function (item) {
    path += '../';
  });

  var url = path + 'cgi-bin/koha/svc/report?name=skolerapport&annotated=1&sql_params=' +
    document.location.search.match(/borrowernumber=([0-9]+)/)[ 1 ];
  return url;
}

function getStyle (doc) {
  var style = doc.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = '
  body
  { font-family: sans-serif; }
  table { font-family: sans-serif; border-collapse: collapse; }
  table th { font-weight: bold; }
  table th, table td { border: 1px solid #000; text-align: left; padding: 0.5em; }
  div.school-name, div.school-code, div.teacher-name { font-weight: bold; }
  button.button { width: 6em; height: 2em; font-size: 1em; }
  ';
  return style;
}

function getTable (doc, data) {
  var table = doc.createElement('table');
  var header = doc.createElement('tr');
  Object.keys(data).forEach(function (key) {
    var th = doc.createElement('th');
    th.innerText = key;
    header.appendChild(th);
  });
  table.appendChild(header);

  data.forEach(function (row) {
    var tr = doc.createElement('tr');
    row.forEach(function (item) {
      var td = doc.createElement('td');
      td.innerText = item.value;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  return table;
}

function getButton (document) {
  var button = document.createElement('button');
  button.type = 'button';
  button.value = 'button';
  button.id = 'button';
  button.className = 'button';
  button.innerText = 'Skriv ut';
  return button;
}

function getScripts (doc, data) {
  var script = doc.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = getJavascript(data);
  return script;
}

function getJavascript (data) {

  return '\n'
    + 'var data = ' + JSON.stringify(data) + ';\n'
    + 'function getFinalPage (doc) {\n'
    + '  var teacher = "' + data[ 0 ].teacher + '";\n'
    + '  var school = "' + data[ 0 ].school + '";\n'
    + '  var schoolCode = "' + data[ 0 ].schoolCode + '";\n'
    + '  var div = doc.createElement("div");\n'
    + '  var sendTextDiv = doc.createElement("div");\n'
    + '  var youngDeichmanDiv = doc.createElement("div");\n'
    + '  var schoolServiceDiv = doc.createElement("div");\n'
    + '  var telephoneDiv = doc.createElement("div");\n'
    + '  var emailDiv = doc.createElement("div");\n'
    + '  var schoolDiv = doc.createElement("div");\n'
    + '  var teacherDiv = doc.createElement("div");\n'
    + '  var schoolCodeDiv = doc.createElement("div");\n'
    + '  div.id = "first-page";\n'
    + '  sendTextDiv.id = "sendText";\n'
    + '  youngDeichmanDiv.id = "youngDeichmanText";\n'
    + '  schoolServiceDiv.id = "schoolServiceText";\n'
    + '  telephoneDiv.id = "telephoneText";\n'
    + '  emailDiv.id = "emailText";\n'
    + '  schoolDiv.id = "schoolText";\n'
    + '  teacherDiv.id = "teacherText";\n'
    + '  schoolCodeDiv.id = "schoolCodeText";\n'
    + '  div.style = "font-family: sans-serif; page-break-after: always;";\n'
    + '  sendTextDiv.style = "font-size: 12pt;";\n'
    + '  youngDeichmanDiv.style = "font-size: 24pt; font-weight: bold;";\n'
    + '  schoolServiceDiv.style = "font-size: 24pt; font-weight: bold;";\n'
    + '  telephoneDiv.style = "font-size: 12pt;";\n'
    + '  emailDiv.style = "font-size: 12pt;";\n'
    + '  schoolDiv.style = "font-size: 12pt; margin-top: 42em;";\n'
    + '  teacherDiv.style = "font-size: 12pt;";\n'
    + '  schoolCodeDiv.style = "font-size: 12pt; font-weight: bold;";\n'
    + '  sendTextDiv.innerText = "En forsendelse fra";\n'
    + '  youngDeichmanDiv.innerText = "Unge Deichman";\n'
    + '  schoolServiceDiv.innerText = "Skoletjenesten";\n'
    + '  telephoneDiv.innerText = "Tlf: 23 43 28 66";\n'
    + '  emailDiv.innerText = "E-post: deichman.skole@kul.oslo.kommune.no";\n'
    + '  schoolDiv.innerText = school;\n'
    + '  teacherDiv.innerText = teacher;\n'
    + '  schoolCodeDiv.innerText = schoolCode;\n'
    + '  div.appendChild(sendTextDiv);\n'
    + '  div.appendChild(youngDeichmanDiv);\n'
    + '  div.appendChild(schoolServiceDiv);\n'
    + '  div.appendChild(telephoneDiv);\n'
    + '  div.appendChild(emailDiv);\n'
    + '  div.appendChild(schoolDiv);\n'
    + '  div.appendChild(teacherDiv);\n'
    + '  div.appendChild(schoolCodeDiv);\n'
    + '  return div;\n'
    + '}\n'
    + 'function formatRows (doc, rows) {\n'
    + '  var table = doc.createElement("table");\n'
    + '  var thead = doc.createElement("tr");\n'
    + '  var thDueDate = doc.createElement("th");\n'
    + '  var thAuthor = doc.createElement("th");\n'
    + '  var thTitle = doc.createElement("th");\n'
    + '  var thMaterialType = doc.createElement("th");\n'
    + '  var thTitleNumber = doc.createElement("th");\n'
    + '  var thExemplar = doc.createElement("th");\n'
    + '  thDueDate.innerText = "Forfallsdato";\n'
    + '  thAuthor.innerText = "Forfatter";\n'
    + '  thTitle.innerText = "Tittel";\n'
    + '  thMaterialType.innerText = "Materialtype";\n'
    + '  thTitleNumber.innerText = "Tittelnummer";\n'
    + '  thExemplar.innerText = "Eksemplarnr.";\n'
    + '  thead.appendChild(thDueDate);\n'
    + '  thead.appendChild(thAuthor);\n'
    + '  thead.appendChild(thTitle);\n'
    + '  thead.appendChild(thMaterialType);\n'
    + '  thead.appendChild(thTitleNumber);\n'
    + '  thead.appendChild(thExemplar);\n'
    + '  table.appendChild(thead);\n'
    + '  for (var i = 0; i < rows.length; i++) {\n'
    + '    var tr = doc.createElement("tr");\n'
    + '    var dueDate = doc.createElement("td");\n'
    + '    var author = doc.createElement("td");\n'
    + '    var title = doc.createElement("td");\n'
    + '    var materialType = doc.createElement("td");\n'
    + '    var titleNumber = doc.createElement("td");\n'
    + '    var exemplar = doc.createElement("td");\n'
    + '    dueDate.innerText = rows[i]["date_due"];\n'
    + '    author.innerText = rows[i]["author"];\n'
    + '    title.innerText = rows[i]["title"];\n'
    + '    materialType.innerText = rows[i]["itype"];\n'
    + '    titleNumber.innerText = rows[i]["biblionumber"];\n'
    + '    exemplar.innerText = rows[i]["copynumber"];\n'
    + '    tr.appendChild(dueDate);\n'
    + '    tr.appendChild(author);\n'
    + '    tr.appendChild(title);\n'
    + '    tr.appendChild(materialType);\n'
    + '    tr.appendChild(titleNumber);\n'
    + '    tr.appendChild(exemplar);\n'
    + '    table.appendChild(tr);\n'
    + '  }\n'
    + '  return table;\n'
    + '}\n'
    + 'function addSecondPageStyling (doc, rows) {\n'
    + '  var div = doc.createElement("div");\n'
    + '  div.className = "second-page";\n '
    + '  var headerDiv = doc.createElement("div");\n'
    + '  var img = doc.createElement("img");\n'
    + '  var span = doc.createElement("span");\n'
    + '  var loansDiv = doc.createElement("div");\n'
    + '  var teacherDetailsDiv = doc.createElement("div");\n'
    + '  var dateDiv = doc.createElement("div");\n'
    + '  img.src = "https://www.deichman.no/sites/all/themes/deichbib_theme/logo.png";\n'
    + '  span.innerText = "Skoletjenesten";\n'
    + '  loansDiv.innerText = "DINE LÅN";\n'
    + '  loansDiv.className = "loans-title";\n'
    + '  teacherDetailsDiv.innerText = rows[0].school + ": " + rows[0].teacher;\n'
    + '  headerDiv.appendChild(img);\n'
    + '  headerDiv.appendChild(span);\n'
    + '  dateDiv.innerText = "Rapport generert: " + Date.now();\n'
    + '  div.appendChild(headerDiv);\n'
    + '  div.appendChild(loansDiv);\n'
    + '  div.appendChild(teacherDetailsDiv);\n'
    + '  div.appendChild(dateDiv);\n'
    + '  return div;\n'
    + '}\n'
    + 'function getStyles (doc) {\n'
    + '  var style = doc.createElement("style");\n'
    + '  style.type = "text/css";'
    + '  style.innerText = "table { font-family: sans-serif; border-collapse: collapse; margin-top: 2em;} "\n'
    + '                  + "table th, table td { text-align: left; font-family: sans-serif; border: 1px solid #000000; padding: 0.5em;}"\n'
    + '                  + "div.second-page { font-family: sans-serif; margin-top: 5em;} "\n'
    + '                  + "div.loans-title { font-size: 2em; } ";\n'
    + '  return style;\n'
    + '}\n\n'
    + 'function openPrintWindow (rows) {\n'
    + '  printWindow = window.open("");\n'
    + '  printWindow.document.head.appendChild(getStyles(printWindow.document));'
    + '  printWindow.document.body.appendChild(getFinalPage(printWindow.document));\n'
    + '  printWindow.document.body.appendChild(addSecondPageStyling(printWindow.document, rows));\n'
    + '  printWindow.document.body.appendChild(formatRows(printWindow.document, rows));\n'
    + '  printWindow.print();\n'
    + '  printWindow.close();\n'
    + '}\n\n'
    + 'document.getElementById("selectAll").addEventListener("click", function () {\n'
    + '  var checkboxes = document.getElementsByTagName("input");\n'
    + '  var checkstate = (this.checked === true) ? true : false;\n'
    + '  Array.prototype.slice.call(checkboxes).forEach( ( item ) => {\n'
    + '    item.checked = checkstate;\n'
    + '  });\n'
    + '});\n'
    + 'document.getElementById("button").addEventListener("click", function() {\n'
    + '  var selection = document.getSelection();\n'
    + '  if (selection.toString() !== "") {\n'
    + '    var arr = [];\n'
    + '    Array.prototype.slice.call(selection\n'
    + '        .getRangeAt(0)\n'
    + '        .cloneContents()\n'
    + '        .querySelectorAll("td.table-one")\n'
    + '    ).forEach(\n'
    + '        (item) => {\n'
    + '            var index = item.getAttribute("data-row-number");\n'
    + '            if (!arr.includes(index)) {arr.push(index);}\n'
    + '    });\n'
    + '    var variableData = [];\n'
    + '    arr.forEach((item) => {variableData.push(data[item])});\n'
    + '    openPrintWindow(variableData);\n'
    + '  } else {\n'
    + '    var checked = document.querySelectorAll(\'input[type=checkbox]:checked\');\n'
    + '    if (checked.length > 0) {\n'
    + '    var arr = [];\n'
    + '    Array.prototype.slice.call(checked).forEach(\n'
    + '        (item) => {\n'
    + '            var index = item.parentNode.getAttribute("data-row-number");\n'
    + '            if (!arr.includes(index)) {arr.push(index);}\n'
    + '    });\n'
    + '    var variableData = [];\n'
    + '    arr.forEach((item) => {variableData.push(data[item])});\n'
    + '    openPrintWindow(variableData);\n'
    + '    } else {alert("Du må velge eller merke noe");}\n'
    + '  }\n'
    + '});\n'
    + 'function sort(table, col, reverse) {'
    + '  var tb = table.tBodies[0],'
    + '  tr = Array.prototype.slice.call(tb.rows, 0), i;'
    + '  reverse = -((+reverse) || -1);'
    + '  tr = tr.sort('
    + '  function (a, b) {'
    + '    return reverse'
    + '      * (a.cells[col].textContent.trim()'
    + '        .localeCompare(b.cells[col].textContent.trim())'
    + '    );'
    + '  });'
    + '  for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]);'
    + '}'
    + 'function makeSortable(table) {'
    + '  var th = table.tHead, i;'
    + '  th && (th = th.rows[0]) && (th = th.cells);'
    + '  if (th) i = th.length;'
    + '  else return;'
    + '  while (--i >= 0) (function (i) {'
    + '    var dir = 1;'
    + '    th[i].addEventListener("click", function () {sort(table, i, (dir = 1 - dir))});'
    + '  }(i));'
    + '}'
    + 'function makeAllSortable(document) {'
    + '  var t = document.getElementById("initialTable");'
    + '  makeSortable(t);'
    + '}'
    + '(function () {makeAllSortable(document);})();';
}

function getMetadata (doc, data) {
  var metadata = doc.createElement('div');
  var school = doc.createElement('p');
  var schoolCode = doc.createElement('p');
  var teacher = doc.createElement('p');
  metadata.className = 'break-after';
  school.className = 'school-name';
  schoolCode.className = 'school-code';
  teacher.className = 'teacher-name';
  school.innerText = data[ 0 ].school;
  schoolCode.innerText = data[ 0 ].schoolCode;
  teacher.innerText = data[ 0 ].teacher;
  metadata.appendChild(school);
  metadata.appendChild(schoolCode);
  metadata.appendChild(teacher);
  metadata.appendChild(formatData(doc, data));
  return metadata;
}

function getCheckbox (doc, rowNumber) {

  var checkbox = doc.createElement('input');
  checkbox.type = 'checkbox';

  if (rowNumber === undefined) {
    checkbox.id = 'selectAll';
    checkbox.className = 'select-all';
  } else {
    checkbox.id = 'cb_' + rowNumber;
    checkbox.className = 'row-selector';
  }

  return checkbox;
}

function getTableCell (doc, rowNumber, data, type) {
  if (type === undefined) {
    type = 'td';
  }
  var cell = doc.createElement(type);
  cell.className = 'table-one';
  cell.setAttribute('data-row-number', rowNumber);
  if (typeof data === 'object' && data !== null) {
    cell.appendChild(data);
  } else {
    cell.innerText = data;
  }

  return cell;
}

function formatData (doc, data) {
  var table = doc.createElement('table');
  table.id = 'initialTable';
  var thead = doc.createElement('thead');
  var headtr = doc.createElement('tr');
  headtr.appendChild(getTableCell(doc, 0, getCheckbox(doc), 'th'));
  headtr.appendChild(getTableCell(doc, 1, 'Utlånsdato', 'th'));
  headtr.appendChild(getTableCell(doc, 2, 'Forfatter', 'th'));
  headtr.appendChild(getTableCell(doc, 3, 'Tittel', 'th'));
  headtr.appendChild(getTableCell(doc, 4, 'Innleveringsdato', 'th'));
  headtr.appendChild(getTableCell(doc, 5, 'Stedskode', 'th'));
  headtr.appendChild(getTableCell(doc, 6, 'Type', 'th'));
  headtr.appendChild(getTableCell(doc, 7, 'Tittelnr.', 'th'));
  headtr.appendChild(getTableCell(doc, 8, 'Eks.nr.', 'th'));
  thead.appendChild(headtr);
  table.appendChild(thead);

  var tbody = doc.createElement('tbody');
  for (var i = 0; i < data.length; i++) {
    var tr = doc.createElement('tr');
    tr.appendChild(getTableCell(doc, i, getCheckbox(doc, i)));
    tr.appendChild(getTableCell(doc, i, data[ i ].issuedate));
    tr.appendChild(getTableCell(doc, i, data[ i ].author));
    tr.appendChild(getTableCell(doc, i, data[ i ].title));
    tr.appendChild(getTableCell(doc, i, data[ i ].date_due));
    tr.appendChild(getTableCell(doc, i, data[ i ].location));
    tr.appendChild(getTableCell(doc, i, data[ i ].itype));
    tr.appendChild(getTableCell(doc, i, data[ i ].biblionumber));
    tr.appendChild(getTableCell(doc, i, data[ i ].copynumber));
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  return table;
}

(init())();
