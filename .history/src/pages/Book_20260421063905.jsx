import { useEffect, useState } from "react";
import API from "../services/api";

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get("/books")
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Daftar Buku</h1>
      {books.map((book) => (
        <div key={book.id}>
          <h3>{book.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default Books;