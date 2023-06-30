const belum_selesai = document.getElementById("belum_selesai");
const selesai = document.getElementById("selesai");

function aksiTambahbutton(inputBookIsComplete, idBook) {
  const textButton = document.createElement("div");
  const aksiBaca = buatAksiBaca(idBook);
  const aksiEdit = buatAksiEdit(idBook);
  const aksiHapus = buatAksiHapus(idBook);
  const aksibacaUlang = buatAksiBacaUlang(idBook);

  if (inputBookIsComplete) {
    textButton.append(aksibacaUlang);
  } else {
    textButton.append(aksiBaca);
  }
  textButton.append(aksiEdit, aksiHapus);
  return textButton;
}

function buatAksiBaca(idBook) {
  const aksiBaca = document.createElement("button");
  aksiBaca.classList.add("green");
  aksiBaca.innerText = "Selesaikan Baca";

  return aksiBaca;
}

function buatAksiEdit(idBook) {
  const aksiEdit = document.createElement("button");
  aksiEdit.classList.add("blue");
  aksiEdit.innerText = "Edit Buku";

  aksiEdit.addEventListener("click", function () {
    let confirmation = confirm("Apakah Anda yakin ingin mengedit buku ini?");

    if (confirmation) {
      const inputBook = document.getElementById(idBook);
      const bookTitle = inputBook.querySelector(
        ".book_shelf > .book_list > .book_item > h1"
      ).innerHTML;

      const bookAuthor = inputBook.querySelectorAll(
        ".book_shelf > .book_list > .book_item > p"
      )[0].innerHTML;
      console.log(bookAuthor);
      const bookYear = inputBook.querySelectorAll(
        ".book_shelf > .book_list > .book_item > p"
      )[1].innerHTML;

      document.getElementById("inputBookTitle").value = bookTitle;
      document.getElementById("inputBookAuthor").value = bookAuthor;
      document.getElementById("inputBookYear").value = bookYear;
      document.getElementById("inputBookIsComplete").checked =
        inputBookIsComplete;

      deleteBuku(idBook);
      document.getElementById(idBook).remove();
    }
  });
  return aksiEdit;
}
let bukuSimpan = [];
function deleteBuku(idBook) {
  fetch("https://apem.webakb.com/rest/hapuspgw.php?kode_buku=" + idBook, {
    method: "Delete",

    mode: "cors",

    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }).then((response) => response.json());
  for (
    let arrayPossition = 0;
    arrayPossition < bukuSimpan.length;
    arrayPossition++
  ) {
    if (bukuSimpan[arrayPossition].id == idBook) {
      bukuSimpan.splice(arrayPossition, 1);
      break;
    }
  }
}
function buatAksiHapus(idBook) {
  const aksiHapus = document.createElement("button");
  aksiHapus.classList.add("red");
  aksiHapus.innerText = "Hapus";

  aksiHapus.addEventListener("click", function () {
    let confirmation = confirm("apakah anda yakin ingin menghapus buku?");

    if (confirmation) {
      const cardParent = document.getElementById(idBook);
      cardParent.addEventListener("eventDelete", function (event) {
        event.target.remove();
      });
      cardParent.dispatchEvent(new Event("eventDelete"));

      deleteBuku(idBook);
      //saveData();
    }
  });

  return aksiHapus;
}

function buatAksiBacaUlang(idBook) {
  const aksibacaUlang = document.createElement("button");
  aksibacaUlang.classList.add("green");
  aksibacaUlang.innerText = "Baca Ulang";

  return aksibacaUlang;
}

const inputForm = document.getElementById("inputBook");
window.addEventListener("load", function () {
  refresh();
});

function refresh() {
    fetch("https://apem.webakb.com/rest/tampilsemuapgw.php", {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    
    .then((response) => response.json()) 
    .then((isiData) => {
      isiData.data.forEach((post) => {
        console.log(post);
        const inputBookIsComplete = post.isComplete;
       
        const idBook = post.kode_buku;

        const judulBuku = document.createElement("h1");
        judulBuku.innerHTML = post.nama;

        const penulisBuku = document.createElement("p");
        penulisBuku.innerHTML += post.penulis;

        const jenisBuku = document.createElement("p");
        jenisBuku.innerHTML += post.jenis;

        const tahunBuku = document.createElement("p");
        tahunBuku.innerHTML += post.tahun;

        const untukButton = aksiTambahbutton(inputBookIsComplete, idBook);
        untukButton.classList.add("action");

        const textContainer = document.createElement("article");
        textContainer.setAttribute("id", idBook);
        textContainer.classList.add("book_item");

        textContainer.append (judulBuku, penulisBuku, jenisBuku, tahunBuku, untukButton);
        if (inputBookIsComplete==1) {
          document.getElementById("selesai").append(textContainer);
        } else {
          document.getElementById("belum_selesai").append(textContainer);
        }
      });
    }) 
    .catch((err) => console.log(err)); 
}

document.addEventListener("DOMContentLoaded", function () {
    inputForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const idBook = +new Date();
        const inputBookTitle = document.getElementById("inputBookTitle").value;
        const inputBookAuthor = document.getElementById("inputBookAuthor").value;
         const inputBookJenis = document.getElementById("inputBookJenis").value;
        const inputBookYear = document.getElementById("inputBookYear").value;
        const inputBookIsComplete = document.getElementById(
            "inputBookIsComplete"
        ).checked;
        let status = 0;
        if (inputBookIsComplete == true) {
            status = 1;
        } else {
            status = 0;
        }
        
        fetch("https://apem.webakb.com/rest/tambahpgw.php", {
            method: "POST",
            mode: "cors",
            body:
                "kode_buku=" +
                idBook +
                "&nama=" +
                inputBookTitle +
                 "&jenis=" +
                 inputBookJenis +
                "&penulis=" +
                inputBookAuthor +
                "&tahun=" +
                inputBookYear +
                "&isComplete=" +
                status,
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded" },
        }).then((response) => {
            window.location.reload();
        });
    });
  });

