/**
 * Orthway.org - Τελικό Script
 * Διαχειρίζεται την τυχαία εμφάνιση πολυτονικών χωρίων στο Header.
 */

const quotes = [
    "«Ἐγώ εἰμι τὸ Ἄλφα καὶ τὸ Ὡμέγα»",
    "«Ἐγώ εἰμι ἡ Ὁδὸς καὶ ἡ Ἀλήθεια καὶ ἡ Ζωή»",
    "«Ἐγώ εἰμι ἡ Ἀνάστασις καὶ ἡ Ζωή»",
    "«Ἐγώ εἰμι τὸ Φῶς τοῦ κόσμου»",
    "«Ἐγώ εἰμι ὁ Ἄρτος τῆς Ζωῆς»",
    "«Ἐγώ εἰμι ἡ Θύρα· διʼ ἐμοῦ ἐάν τις εἰσέλθῃ, σωθήσεται»",
    "«Ἐγώ εἰμι ὁ Ποιμὴν ὁ καλός»",
    "«Ἐγώ εἰμι ἡ Ἄμπελος ἡ ἀληθινή»",
    "«Ὁ Ὤν καὶ ὁ Ἦν καὶ ὁ ἐρχόμενος, ὁ Παντοκράτωρ»",
    "«Ἰδοὺ καινὰ ποιῶ πάντα»",
    "«Ὁ ζῶν καὶ ἐγενόμην νεκρός, καὶ ἰδοὺ ζῶν εἰμι εἰς τοὺς αἰῶνας τῶν αἰώνων»"
];

function showRandomQuote() {
    const display = document.getElementById('quote-display');
    if (display) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        display.innerText = quotes[randomIndex];
    }
}

// Εκτέλεση όταν φορτώσει η σελίδα
window.onload = function() {
    showRandomQuote();
};