const SHEET_URL =
'https://opensheet.elk.sh/10vvbb7lJ-gl-y7ipwK8hQMkSC69r1kiQeOq8KSWQ3OU/Sheet1';


const list = document.getElementById('list');
const search = document.getElementById('search');
const provinceFilter =
document.getElementById('provinceFilter');
const provinceButtons =
document.getElementById('provinceButtons');
const stats =
document.getElementById('stats');
const loadMoreBtn =
document.getElementById('loadMoreBtn');

let allData = [];
let visibleCount = 5;

function render(data){

    list.innerHTML = '';

    data.slice(0, visibleCount).forEach(row => {

        if(!row["Tên quán"]) return;

        const card = document.createElement('div');

        card.className = 'card';

    card.innerHTML = `
<div class="card-left">

    <img
        src="images/logo.jpg"
        class="venue-logo"
        alt="Tê Tê Beer"
    >

    <div class="venue-info">

        <h3>${row["Tên quán"]}</h3>

        <div class="province">
            📍 ${row["Thành phố"] || ""}
        </div>

        <p>
            ${row["Địa chỉ cụ thể"] || ""}
        </p>

    </div>

</div>

<a
    class="btn"
    href="${row["Link gg map"] || "#"}"
    target="_blank"
>
    Chỉ đường ↗
</a>
`;

        list.appendChild(card);

    });

}

fetch(SHEET_URL)
.then(res => res.json())
.then(data => {

   allData = data;
   const validData =
   allData.filter(x => x["Tên quán"]);

const provinces = [
    ...new Set(
        allData
        .map(x => x["Thành phố"])
        .filter(Boolean)
    )
];

provinces.sort();

provinces.forEach(province => {

    const option =
    document.createElement('option');

    option.value = province;
    option.textContent = province;

    provinceFilter.appendChild(option);

});
const allButton =
document.createElement('button');

allButton.className =
'province-btn active';


allButton.textContent =
`Tất cả (${validData.length})`;

allButton.dataset.province = '';

provinceButtons.appendChild(allButton);

provinces.forEach(province => {

    const btn =
    document.createElement('button');

    btn.className =
    'province-btn';

    const count =
allData.filter(
    x => x["Thành phố"] === province
).length;

btn.textContent =
`${province} (${count})`;

    btn.dataset.province =
    province;

    provinceButtons.appendChild(btn);

});

render(validData);

stats.textContent =
`🍺 ${validData.length} venues serving Tê Tê Beer`;
});
provinceFilter.addEventListener('change', filterData);

search.addEventListener('input', filterData);

function filterData(){
    visibleCount = Math.max(visibleCount,5);

    const keyword =
    search.value.toLowerCase();

    const province =
    provinceFilter.value;

    const filtered =
    allData.filter(row => {

        const name =
        (row["Tên quán"] || "")
        .toLowerCase();

        const matchName =
        name.includes(keyword);

        const matchProvince =
        !province ||
        row["Thành phố"] === province;

        return matchName && matchProvince;

    });

    render(filtered);

stats.textContent =
`🍺 ${filtered.length} venues found`;

if(filtered.length <= visibleCount){

    loadMoreBtn.style.display = 'none';

}else{

    loadMoreBtn.style.display = 'inline-block';

}

}
if(provinceButtons){
loadMoreBtn.addEventListener('click', () => {

    visibleCount += 5;

    filterData();

});    

    provinceButtons.addEventListener('click', (e) => {

        if(
            !e.target.classList.contains(
                'province-btn'
            )
        ) return;

        document
        .querySelectorAll('.province-btn')
        .forEach(btn =>
            btn.classList.remove('active')
        );

        e.target.classList.add('active');

        provinceFilter.value =
        e.target.dataset.province;

        filterData();

    });

}

