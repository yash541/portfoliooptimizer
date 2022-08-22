let globalChart = [];
const submit = async (e) => {
  globalChart.forEach((g) => g.destroy());
  globalChart = [];
 
  e.preventDefault();

  const stock = document.getElementById("stock").value;
  if(stock.split(" ").length<2){
    document.getElementById("stock").classList.add("is-invalid");
    document.getElementById("errorHelp").innerHTML = "Minimum two stock tickers required"
    minRiskDiv.innerHTML = "";
    maxReturnDiv.innerHTML="";
    return
  }
  else{
    document.getElementById("stock").classList.remove("is-invalid");
    document.getElementById("errorHelp").innerHTML="";
  }
  document.getElementById("loading").style.display = "block";
  document.getElementById("submit").disabled = true;

  const response = await fetch(
    "http://127.0.0.1:5000/api/portfolio?tickers=" + stock,
    {
      method: "GET",
    }
  );
  
  const json = await response.json();
  const minRiskDiv = document.getElementById("min-risk");
  minRiskDiv.innerHTML = '<p class="risktitle">MIN RISK </p>';

  const maxReturnDiv = document.getElementById("max-return");
  maxReturnDiv.innerHTML = '<p class="risktitle">MAX RETURN</p>';
  const minRisk = JSON.parse(json.minRisk);



  const maxReturn = JSON.parse(json.maxReturn);
  const df = JSON.parse(json.df);
  const minRiskTable = getTable(minRisk);
  const maxReturnTable = getTable(maxReturn);
  minRiskDiv.appendChild(minRiskTable);
  maxReturnDiv.appendChild(maxReturnTable);
  document.getElementById("submit").disabled = false;
  document.getElementById("loading").style.display = "none";

  let y = [];
  let x = [];
  for (let [key, value] of Object.entries(minRisk)) {
    let k = Object.keys(value)[0];
    let v = value[k];
    x.push(key);
    y.push(v);
  }
  y.splice(0, 3);
  x.splice(0, 3);

  let ym = [];
  let xm = [];
  for (let [key, value] of Object.entries(maxReturn)) {
    let k = Object.keys(value)[0];
    let v = value[k];
    xm.push(key);
    ym.push(v);
  }
  ym.splice(0, 3);
  xm.splice(0, 3);

  let colors = ["red", "green", "blue", "yellow", "purple","black"];
  let xValues = [];
  df.index.forEach((e) => {
    let date = new Date(e);
    let d =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    xValues.push(d);
  });
  let datasets = [];
  df.columns.forEach((e, i) => {
    let data = {
      data: [],
      label: e,
      borderColor: colors[i],
      fill: false,
    };
    datasets.push(data);
  });
  console.log({datasets,xValues});
  df.data.forEach((element) => {
    element.forEach((e, i) => {
      datasets[i].data.push(e);
    });
  });


  globalChart.push(
    new Chart("mypie", {
      type: "pie",
      data: {
        labels: x,
        datasets: [
          {
            label: "My First Dataset",
            data: y,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "MINIMUM RISK PORTFOLIO"
        },
        legend: {
          position: 'top',
        },
      },
    })
  );
  globalChart.push(
    new Chart("mypiem", {
      type: "pie",
      data: {
        labels: xm,
        datasets: [
          {
            label: "My First Dataset",
            data: ym,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: 'MAXIMUM RETURN PORTFOLIO'
        },
        legend: {
          position: 'top',
        },
      },
    })
  );
  document.getElementById("leftchartname").innerHTML = "MINIMUM RISK PORTFOLIO"
  document.getElementById("rightchartname").innerHTML = 'MAXIMUM RETURN PORTFOLIO'
  const k=document.getElementById("allgraph")
  k.innerHTML = ""
  datasets.forEach((datast)=>{
    newGraph({xValues,datasets:[datast]},datast.label,k,globalChart)
  })
  newGraph({xValues,datasets},'myChart',k,globalChart)
};
document.getElementById("submit").addEventListener("click", submit);

const getTable = (data) => {
  let table = document.createElement("table");
  table.className = "table table-bordered";
  for (let [key, value] of Object.entries(data)) {
    let k = Object.keys(value)[0];
    let v = parseFloat(value[k]).toFixed(6);

    table.innerHTML += `<tr> <td class="key_name">${key}</td> <td>${v}</td></tr>`;
  }
  return table;
};

const newGraph = (data,name,el,globalcharts) => {
  const canv = document.createElement('canvas')
  canv.style ="max-height: 500px; max-width: 1000px;"
  canv.id=name
  el.appendChild(canv)

  globalcharts.push(
    new Chart(name, {
      type: "line",
      data: {
        labels: data.xValues,
        datasets: data.datasets,
      },
      options: {
        legend: { display: false },
      },
    })
  )
}