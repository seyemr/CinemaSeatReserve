document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".container");
    const count = document.getElementById("count");
    const amount = document.getElementById("amount");
    const movieList = document.querySelector("#movie");
    const infoText = document.querySelector(".infoText");
    const seats = document.querySelectorAll(".seat:not(.reserved)");
    const loverSeats = document.querySelectorAll(".lover");

    // Veritabanı Fonksiyonu
    const saveSeatsToDatabase = (seatIndex, loverIndex) => {
        localStorage.setItem("seatsIndex", JSON.stringify(seatIndex));
        localStorage.setItem("loverIndex", JSON.stringify(loverIndex));
        localStorage.setItem("movieIndex", JSON.stringify(movieList.selectedIndex));
    };

    // Veri tabanındaki index bilgisini alıyoruz.
    const getSeatsFromDatabase = () => {
        const dbSelectedSeats = JSON.parse(localStorage.getItem("seatsIndex"));
        const dbSelectedLover = JSON.parse(localStorage.getItem("loverIndex"));
        if (dbSelectedSeats !== null && dbSelectedSeats.length > 0) {
            seats.forEach((seat, index) => {
                if (dbSelectedSeats.includes(index)) {
                    seat.classList.add('selected');
                }
            });
        }

        if (dbSelectedLover !== null && dbSelectedLover.length > 0) {
            loverSeats.forEach((lover, index) => {
                if (dbSelectedLover.includes(index)) {
                    lover.classList.add('selected');
                }
            });
        }

        const dbSelectedMovie = JSON.parse(localStorage.getItem("movieIndex"));
        movieList.selectedIndex = dbSelectedMovie;
    };

    getSeatsFromDatabase();

    // Koltukların index verilerini tespit etme fonksiyonu
    const createSeatsIndex = () => {
        const allSeatsArray = Array.from(seats);
        const allLoverArray = Array.from(loverSeats);

        const allSelectedSeatsArray = Array.from(container.querySelectorAll(".seat.selected"));
        const allSelectedLoverArray = Array.from(container.querySelectorAll(".lover.selected"));

        const selectedSeatsIndexs = allSelectedSeatsArray.map(selectedSeat => allSeatsArray.indexOf(selectedSeat));
        const selectedLoverIndexs = allSelectedLoverArray.map(selectedLover => allLoverArray.indexOf(selectedLover));

        saveSeatsToDatabase(selectedSeatsIndexs, selectedLoverIndexs);
    };

    // Hesaplama Fonksiyonu
    const calculateTotal = () => {
        createSeatsIndex();

        let selectedSeatsCount = container.querySelectorAll(".seat.selected").length;
        let selectedLoverCount = container.querySelectorAll(".lover.selected").length;

        count.innerText = selectedSeatsCount + selectedLoverCount;
        amount.innerText = (selectedSeatsCount + selectedLoverCount) * movieList.value;

        if (selectedSeatsCount || selectedLoverCount) {
            infoText.classList.add("open");
        } else {
            infoText.classList.remove("open");
        }
    };

    calculateTotal();

    container.addEventListener('click', (mouseEvent) => {
        const clickedSeat = mouseEvent.target.closest('.seat');
        const clickedLover = mouseEvent.target.closest('.lover');

        if (clickedSeat && !clickedSeat.classList.contains("reserved")) {
            clickedSeat.classList.toggle("selected");
        }

        if (clickedLover) {
            clickedLover.classList.toggle("selected");
        }

        calculateTotal();
    });

    movieList.addEventListener("change", () => {
        calculateTotal();
    });
});