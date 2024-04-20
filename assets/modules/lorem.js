const loremWordList = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "Nullam",
  "viverra",
  "odio",
  "eu",
  "turpis",
  "facilisis",
  "iaculis",
  "Curabitur",
  "felis",
  "dui",
  "tempor",
  "non",
  "euismod",
  "pretium",
  "imperdiet",
  "vel",
  "Pellentesque",
  "varius",
  "hendrerit",
  "orci",
  "vitae",
  "porttitor",
  "Lorem",
  "Morbi",
  "nec",
  "porta",
  "enim",
  "Suspendisse",
  "ut",
  "accumsan",
  "Sed",
  "bibendum",
  "sed",
  "laoreet",
  "Ut",
  "in",
  "eleifend",
  "nisl",
  "Aliquam",
  "cursus",
  "magna",
  "id",
  "augue",
  "elementum",
  "Proin",
  "scelerisque",
  "eros",
  "tincidunt",
  "rhoncus",
  "auctor",
  "Donec",
  "nulla",
  "erat",
  "ultricies",
  "ac",
  "eget",
  "faucibus",
  "feugiat",
  "risus",
  "In",
  "nunc",
  "finibus",
  "tortor",
  "blandit",
  "posuere",
  "ex",
  "Praesent",
  "massa",
  "ante",
  "purus",
  "suscipit",
  "ornare",
  "nisi",
  "Maecenas",
  "tristique",
  "lectus",
  "Quisque",
  "fringilla",
  "molestie",
  "at",
  "hac",
  "habitasse",
  "platea",
  "dictumst",
  "Nulla",
  "velit",
  "malesuada",
  "Vestibulum",
  "pharetra",
  "urna",
  "dapibus",
  "arcu",
  "dignissim",
  "metus",
  "commodo",
  "diam",
  "sollicitudin",
  "neque",
  "tellus",
  "tempus",
  "convallis",
  "libero",
  "lacinia",
  "Vivamus",
  "vehicula",
  "sagittis",
  "venenatis",
  "ultrices",
  "sapien",
  "Etiam",
  "nibh",
  "lobortis",
  "Cras",
  "fermentum",
  "Phasellus",
  "efficitur",
  "dictum",
  "et",
  "mi",
  "volutpat",
  "justo",
  "ullamcorper",
  "consequat",
  "gravida",
  "Nunc",
  "Aenean",
  "rutrum",
  "congue",
  "quis",
  "interdum",
  "Integer",
  "leo",
  "condimentum",
  "Nam",
  "mollis",
  "est",
  "sodales",
  "pulvinar",
  "sem",
  "egestas",
  "vulputate",
  "aliquam",
  "quam",
  "semper",
  "pellentesque",
  "luctus",
  "lacus",
  "vestibulum",
  "mauris",
  "placerat",
  "ligula",
  "mattis",
  "maximus",
  "aliquet",
  "Fusce",
  "aenean",
];

const lorem = {
  init() {
    const loElements = document.querySelectorAll(".lo");
    if (loElements.length > 0) {
      for (let i = 0; i < loElements.length; i++) {
        switch (loElements[i].tagName) {
          case "SPAN":
          case "P":
          case "A":
          case "H1":
          case "H2":
          case "H3":
          case "H4":
          case "H5":
          case "H6":
            let classes = loElements[i].classList;
            for (let j = 0; j < classes.length; j++) {
              if (classes[j] === "lo") {
                if (!isNaN(classes[j + 1])) {
                  loElements[i].innerHTML = lorem.buildLorem(Number(classes[j + 1]));
                }
              }
            }
            break;

          default:
            console.error(`Lorem Ipsum not supported with ${loElements[i].tagName.toLowerCase()} tag`);
        }
      }
    }
  },
  buildLorem(num) {
    let finalString;
    let wordArr = lorem.createCollection(num);
    num > 7 ? (finalString = lorem.punctuate(wordArr).join(" ")) : (finalString = wordArr.join(" "));
    return finalString;
  },
  createCollection(num) {
    let collection = [];
    for (let i = 0; i < num; i++) {
      let loremWord = lorem.pickRandom(loremWordList);
      if (i === 0) {
        loremWord = lorem.makeFirst(loremWord);
      } else if (i === num - 1) {
        loremWord = lorem.makeLast(loremWord);
      }
      collection.push(loremWord);
    }
    return collection;
  },
  punctuate(words) {
    let counter = 0;
    let rand = 6;
    while (counter < words.length - 1) {
      words[rand] = lorem.makeLast(words[rand]);
      words[rand + 1] = lorem.makeFirst(words[rand + 1]);
      let num = 4 + Math.floor(Math.random() * 5);
      rand = num + counter;
      counter += num;
    }
    return words;
  },
  makeFirst(word) {
    let firstLetter = word[0].toUpperCase();
    let remainLetters = word.slice(1);
    word = firstLetter + remainLetters;
    return word;
  },
  makeLast(word) {
    return word.toLowerCase() + lorem.pickRandom([".", "!", "?"]);
  },
  pickRandom(choices) {
    let rand = Math.floor(choices.length * Math.random());
    return choices[rand];
  },
};

export default lorem;
