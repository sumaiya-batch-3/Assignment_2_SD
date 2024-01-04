const categorySection = document.getElementById("category_section");
const showContent = document.getElementById("show_content");
const errorPageSection = document.getElementById("error_page_section");
const verifiedIcon = document.getElementById("verified_icon");
const sortButton = document.getElementById("sort_by_views");


let isDescending = false;
let categoryId = null;

sortButton.addEventListener('click', () => {
    isDescending = !isDescending;
    selectedCategory(categoryId)
})
// console.log(categorySection)



const loadCategoryData = async () => {
    const response = await fetch("https://openapi.programming-hero.com/api/videos/categories")
    const data = await response.json();
    displayCategoryData(data.data)

}
loadCategoryData()
const displayCategoryData = (data) => {
    selectedCategory(1000)
    data.forEach(el => {

        const newDiv = document.createElement('div');
        newDiv.innerHTML = ` <div class="all pe-2 ">
        <button id='category_button_active' onclick="selectedCategory(${el.category_id})" class="btn btn-secondary category_btn">${el.category}</button>
    </div>`
        categorySection.appendChild(newDiv)
    })



}

// display the selected category content
const selectedCategory = (id) => {
    categoryId = id;
    try {
        fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
            .then(res => res.json())
            .then(data => displayDataByCategoryWise(data.data))
    } catch (error) {
        console.log(error)
    }
}

// display data by category wise 
const displayDataByCategoryWise = (data) => {

    // console.log(data[0])

    const sortedData = JSON.parse(JSON.stringify(data));
    // Sort the data based on views
    sortedData.sort((a, b) => {
        const viewsA = parseInt(a.others.views);
        const viewsB = parseInt(b.others.views);

        // Use a ternary operator to determine the sort order
        return isDescending ? viewsB - viewsA : viewsA - viewsB;
    });




    if (sortedData.length != 0) {
        errorPageSection.classList.add('d-none');

        showContent.innerHTML = ''
        sortedData.forEach((el) => {

            // console.log(el.authors[0].profile_name)
            const showDataDiv = document.createElement("div");
            showDataDiv.innerHTML = `
            <div class="col">
                <div class="card">

                <div class="card_image_container">
                <img src=${el.thumbnail} class="card-img-top card_image" alt="...">
                        <div class="post_time">
                            <p class="p-0 m-0">${el.others.posted_date ? convertTime(el.others.posted_date) : ""}</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="profile_img_section">
                                <img class="img-fluid profile_img" src=${el.authors[0].profile_picture} alt="">
                            </div>
                            <div class="profile_content ps-2">
                                <h6>${el.title}</h6>
                                <div class="d-flex">
                                    <p class="py-0 pe-2 m-0">${el.authors[0].profile_name}</p>
                                    ${el.authors[0].verified == true ? `<i id="verified_icon" class="text-primary bi bi-patch-check-fill"></i>` : ""}
                                </div>
                                <p class="py-0 my-0">${el.others.views}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
            showContent.appendChild(showDataDiv)
        })
    } else {
        showContent.innerHTML = ''
        errorPageSection.classList.remove('d-none');
    }


}

// convert seconds to hours and minutes 
const convertTime = (seconds) => {
    let timestamp = seconds;
    let getHours = Math.floor(timestamp / 60 / 60);
    let getMinutes = Math.floor(timestamp / 60) - (getHours * 60);
    return `${getHours} hours ${getMinutes} minutes ago`
}

// convertTime(33333)
