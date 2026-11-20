
var API_URL = 'https://script.google.com/macros/s/AKfycbwiKuhxkTwLmOPInrYrMLwLgWSnObU9QnHDiSBPrUnk0si8l4GcKgfmQ5XDSDuSWixf/exec';

var KEYS = [
    'srNo', 'rollNo', 'name',
    'tenth', 'twelfth', 'sem1', 'sem2'
];

var LABELS = [
    'Sr No', 'Roll No', 'Student Name',
    '10th', '12th', 'Sem 1', 'Sem 2'
];

var students = [];
var sortKey = null;
var sortAsc = true;

var tbody = document.getElementById('tbody');
var statusEl = document.getElementById('status');
var countEl = document.getElementById('count');
var searchBox = document.getElementById('searchBox');

// Load data from Google Sheets
function loadData() {

    statusEl.textContent = 'Loading...';

    fetch(API_URL)
        .then(function (res) {
            if (!res.ok) {
                throw new Error('Network response error');
            }
            return res.json();
        })
        .then(function (data) {

            students = data;

            statusEl.textContent = '';

            render();

        })
        .catch(function (err) {

            statusEl.textContent =
                'Could not load data. Check the URL.';

            console.error(err);

        });
}

// Search, sort and display students
function render() {

    var q = searchBox.value.trim().toLowerCase();

    var list = students.filter(function (s) {

        return String(s.rollNo).toLowerCase().indexOf(q) !== -1 ||
               String(s.name).toLowerCase().indexOf(q) !== -1;

    });

    // Sorting
    if (sortKey) {

        list.sort(function (a, b) {

            var x = a[sortKey];
            var y = b[sortKey];

            var nx = parseFloat(x);
            var ny = parseFloat(y);

            var r = (!isNaN(nx) && !isNaN(ny))
                ? nx - ny
                : String(x).localeCompare(String(y));

            return sortAsc ? r : -r;

        });

    }

    // Clear old table
    tbody.innerHTML = '';

    // Display records
    list.forEach(function (s) {

        var tr = document.createElement('tr');

        KEYS.forEach(function (k, i) {

            var td = document.createElement('td');

            td.textContent = s[k];

            td.setAttribute('data-label', LABELS[i]);

            tr.appendChild(td);

        });

        tbody.appendChild(tr);

    });

    countEl.textContent =
        'Showing ' + list.length +
        ' of ' + students.length + ' students';

}

// Search as user types
searchBox.addEventListener('input', render);

// Sort when clicking column headings
document.querySelectorAll('th').forEach(function (th) {

    th.addEventListener('click', function () {

        var key = th.getAttribute('data-key');

        if (sortKey === key) {

            sortAsc = !sortAsc;

        } else {

            sortKey = key;
            sortAsc = true;

        }

        render();

    });

});

// Start loading
loadData();