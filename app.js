const {comp, html, render} = hypersimple;

const policy = [
  { category: "Size and shape of data", questions: [
    {text: "Super small amount ", color: "green"},
    {text:"Their activity results in outcomes that align with our mission.", color: "green"},
    {text:"Petabytes", color: "green"},
  ]},
  { category: "Privacy / Encryption", questions: [
    {text: "Encrypted, can't be on public network", color: "green"},
    {text: "Encrypted, can be on public network", color: "green"},
    {text: "Totally public", color: "green"},
  ]},
  { category: "Availability", questions: [
    {text: "Hot - online 24/7, five 9s of sub 500ms response time", color: "green"},
    {text: "Warm - casual access is fine, can design around a wait, but needs to be online", color: "green"},
    {text: "Cold - periodic retrieval within a few days of request", color: "green"},
  ]},
  { category: "Scale", questions: [
    {text: "Just a few files between friends", color: "green"},
    {text: "Thousands of users, at this point", color: "green"},
    {text: "Designing for millions of simultaneous users", color: "green"},
  ]},
  { category: "Who's paying", questions: [
    {text: "Design is that nobody is paying anything", color: "green"},
    {text: "Our company will pay for the IPFS availability cost", color: "green"},
    {text: "The users will pay for the IPFS availability cost of their data", color: "green"},
    {text: "On-chain storage endowment pays pinning system via yield from one-time staked tokens", color: "green"},
  ]},
  { category: "Update frequency", questions: [
    {text: "Data updates constantly", color: "yellow"},
    {text: "Data updates now and then", color: "yellow"},
    {text: "Data is written once, never again", color: "yellow"},
  ]},
  { category: "Deletions / Censorship", questions: [
    {text: "All data must be immediately delete-able at all times", color: "yellow"},
    {text: "Delete requests should be possible", color: "yellow"},
    {text: "Data cannot be taken down ever, at the network level", color: "yellow"},
    {text: "Data can be removed by publisher", color: "yellow"},
  ]},
  { category: "Misc", questions: [
    {text: "Needs to sync data between users or nodes", color: "yellow"},
    {text: "Publishing a website, also to HTTP", color: "yellow"},
    
  ]},
];

const PolicyForm = comp(model => html`
  <div class="form">
    ${model.policy.map(Category)}
  </div>
`);

const Category = comp(model => html`
  <div class="category">
    <h3>${model.category}</h3>
    <div>
      ${model.questions.map(Question)}
    </div>
  </div>
`);

const Question = comp(model => html`
  <div class="question">
    <div>
      <input id="${model.text}" type=checkbox checked=${model.checked}
        onchange="${function() { emit('onCheck', {checked: this.checked, text: model.text})}}">
    </div>
    <div>
      <label for="${model.text}">${model.text}</label>
    </div>
  </div>
`);

const ReportMarkdown = comp(model => html`
  <div class="reportmarkdown">
  ${model.policy
    .filter(category => category.questions.some(q => q.checked))
    .map(CategoryMarkdown)
  }
  </div>
`);

const CategoryMarkdown = comp(model => html`
  <div>
  **${model.category}**
  <br><br>
  ${model.questions.filter(q => q.checked).map(QuestionMarkdown)}
  <br>
  </div>
`);

const QuestionMarkdown = comp(model => {
  let ijome = {green: '✅', yellow: '⚠️', red: '🚫'};
  return html`
  * <span>${ijome[model.color]} </span>${model.text}<br>
`});

const Report = comp(model => html`
  <div class="report">${model.policy
    .filter(category => category.questions.some(q => q.checked))
    .map(CategoryReport)
  }</div>
`);

const CategoryReport = comp(model => html`
  <div class="reportcategory ">
    <h3>${model.category}</h3>
    <ul>
      ${model.questions.filter(q => q.checked).map(QuestionReport)}
    </ul>
  </div>
`);

const QuestionReport = comp(model => html`
  <li><span class="${model.color}">${model.text}</span></li>
`);

// main app
const App = comp(model => html`
  <header>
    <h1>
      IPFS Publishing Decisioning
    </h1>
  </header>
  <main>
    <p>You want to publish your files or data to IPFS?
      Check the matching boxes below, and see your choices magically generated!</p>
    <div class="legend" style="width: 100%;">
      <p>Legend:</p>
      <ul>
        <li>✅ - This is probably worth doing, and could be great.
        <li>⚠️  - We should carefully consider the trade-offs.
        <li>🚫 - This could be dangerous for the project and organization.
      </ul>
    </div>
    <div class="container">
      ${PolicyForm(model)}
      ${ReportMarkdown(model)}
    </div>
  </main>
  <footer>
    ⚙️ ⚙️ ⚙️
  </footer>
`);

// model: it will be mutated to trigger updates on changes
let model = {
  policy: policy,
  checked: 0,
  onCheck: function(e) {
    model.policy.some(cat => {
      let index = cat.questions.findIndex(el => el.text == e.detail.text);
      if (index != -1) {
        cat.questions[index].checked = e.detail.checked;
        return true;
      }
    });
    model.checked += e.detail.checked ? 1 : -1;
  }
};

window.addEventListener('onCheck', model.onCheck);

function emit(name, data) {
  window.dispatchEvent(new CustomEvent(name, { detail: data }));
}

// render
render(document.body, () => App(model));
