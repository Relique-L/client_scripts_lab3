const form = document.getElementById("postForm");
const status = document.getElementById("status");
const postsList = document.getElementById("posts");
const loadBtn = document.getElementById("load");
const submitBtn = document.getElementById("submit");

let allPosts = [];

const render = (posts) => {
    postsList.textContent = "";
    posts.forEach((post) => {
        const li = document.createElement("li");

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("post-content");

        const idSpan = document.createElement("span");
        idSpan.textContent = post.id;
        idSpan.classList.add("post-id")

        const titleSpan = document.createElement("span");
        titleSpan.textContent = post.title;
        titleSpan.classList.add("post-title");

        const bodyP = document.createElement("p");
        bodyP.textContent = post.body;
        bodyP.classList.add("post-body");

        contentDiv.append(idSpan, titleSpan, bodyP);

        li.append(contentDiv);
        
        postsList.appendChild(li);
    });
};

loadBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    loadBtn.disabled = true;
    status.textContent = "Загрузка...";
    status.classList.remove("ok")
    status.classList.remove("error")
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        // const response = await fetch("https://jsonplaceholder.typicode.com/postz"); // проверка 404
        if (response.ok) {
            allPosts = await response.json();
            status.textContent = `Данные успешно загружены. Код ответа: ${response.status}`;
            status.classList.add("ok")
            status.classList.remove("error")
            render(allPosts);
        }
        else {
            status.textContent = `Не удалось загрузить данные. Код ответа: ${response.status}`;
            status.classList.remove("ok")
            status.classList.add("error")
        }
    } catch (error) {
        status.textContent = `Сетевая ошибка: ${error.message}`;
        status.classList.remove("ok")
        status.classList.add("error")
    }
    finally {
        loadBtn.disabled = false;
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    if (title === "" || body === "") {
        status.textContent = "Заголовок и текст публикации не могут быть пустыми";
        status.classList.remove("ok")
        status.classList.add("error")
        return;
    }

    const newPost = {
        title: title,
        body: body,
        userId: 1,
    };

    submitBtn.disabled = true;
    status.textContent = "Отправка...";
    status.classList.remove("ok")
    status.classList.remove("error")
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
        });
        if (response.ok) {
            const data = await response.json();
            allPosts = [];
            allPosts.push(data);
            status.textContent = `Данные успешно отправлены. Код ответа: ${response.status}`;
            status.classList.add("ok")
            status.classList.remove("error")
            render(allPosts);
        }
        else {
            status.textContent = `Не удалось загрузить данные. Код ответа: ${response.status}`;
            status.classList.remove("ok")
            status.classList.add("error")
        }
    } catch (error) {
        status.textContent = `Сетевая ошибка: ${error.message}`;
        status.classList.remove("ok")
        status.classList.add("error")
    } finally {
        submitBtn.disabled = false;
    }
});
