const ctx = document.getElementById("chart");

Chart.defaults.color = "#00000";
Chart.defaults.font.family = "Work Sans";

new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Income",
        data: [2235, 3250, 1890, 5400, 2240, 6254,  2325, 4856, 1325, 2254, 3000, 3486],
        backgroundColor: "white",
        borderColor: "#3DA06E",
        borderRadius: 6,
        cubicInterpolationMode: 'monotone',
        fill: false,
        borderSkipped: false,
      },
    ],
  },
  options: {
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point:{
          radius: 0
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "",
        padding: {
          bottom: 14,
        },
        font: {
          size: 1,
          weight: "normal",
        },
      },
      tooltip: {
        backgroundColor: "#2B2B2B",
        bodyColor: "#fff",
        yAlign: "bottom",
        cornerRadius: 4,
        titleColor: "#fff",
        usePointStyle: true,
        callbacks: {
          label: function(context) {
              if (context.parsed.y !== null) {
                const label = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                return label;
              }
              return null;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
            color: "#eeeded",
          },
        border: {
          dash: [0],
        },
        title: {
          text: "2023",
        },
      },
      y: {
        grid: {
          color: "#eeeded",
        },
        border: {
          dash: [0],
        },
    
        title: {
          display: false,
          text: "Income [$]",
        },
      },
    },

  },
});


const ctx2 = document.getElementById("chart2");

Chart.defaults.color = "#00000";
Chart.defaults.font.family = "Work Sans";

new Chart(ctx2, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Income",
        data: [223, 325, 189, 540, 224, 625,  232, 485, 132, 225, 300, 348]
        ,
        backgroundColor: "white",
        borderColor: "#3DA06E",
        borderRadius: 6,
        cubicInterpolationMode: 'monotone',
        fill: false,
        borderSkipped: false,
      },
    ],
  },
  options: {
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point:{
          radius: 0
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "",
        padding: {
          bottom: 14,
        },
        font: {
          size: 1,
          weight: "normal",
        },
      },
      tooltip: {
        backgroundColor: "#2B2B2B",
        bodyColor: "#fff",
        yAlign: "bottom",
        cornerRadius: 4,
        titleColor: "#fff",
        usePointStyle: true,
        callbacks: {
          label: function(context) {
              if (context.parsed.y !== null) {
                const label = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                return label;
              }
              return null;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
            color: "#eeeded",
          },
        border: {
          dash: [0],
        },
        title: {
          text: "2023",
        },
      },
      y: {
        grid: {
          color: "#eeeded",
        },
        border: {
          dash: [0],
        },
    
        title: {
          display: false,
          text: "Income [$]",
        },
      },
    },

  },
});

const ctx3 = document.getElementById("chart3");

Chart.defaults.color = "#00000";
Chart.defaults.font.family = "Work Sans";

new Chart(ctx3, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Income",
        data: [2235, 3250, 1890, 5400, 2240, 6254,  2325, 4856, 1325, 2254, 3000, 3486],
        backgroundColor: "white",
        borderColor: "#3DA06E",
        borderRadius: 6,
        cubicInterpolationMode: 'monotone',
        fill: false,
        borderSkipped: false,
      },
    ],
  },
  options: {
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point:{
          radius: 0
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "",
        padding: {
          bottom: 14,
        },
        font: {
          size: 1,
          weight: "normal",
        },
      },
      tooltip: {
        backgroundColor: "#2B2B2B",
        bodyColor: "#fff",
        yAlign: "bottom",
        cornerRadius: 4,
        titleColor: "#fff",
        usePointStyle: true,
        callbacks: {
          label: function(context) {
              if (context.parsed.y !== null) {
                const label = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                return label;
              }
              return null;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
            color: "#eeeded",
          },
        border: {
          dash: [0],
        },
        title: {
          text: "2023",
        },
      },
      y: {
        grid: {
          color: "#eeeded",
        },
        border: {
          dash: [0],
        },
    
        title: {
          display: false,
          text: "Income [$]",
        },
      },
    },

  },
});
