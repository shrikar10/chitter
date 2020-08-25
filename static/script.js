const deleteBtns = document.querySelectorAll(".delete-btn");

deleteBtns.forEach((btn) => btn.addEventListener("click", deleteItem));

function deleteItem() {
  if (confirm("Are you sure?")) {
    const delRes = this.dataset.resource;
    console.log(delRes);
    fetch(`/${delRes}`, { method: "DELETE" })
      .then((json) => (window.location = "/"))
      .catch((err) => {
        alert(err);
      });
  }
}
