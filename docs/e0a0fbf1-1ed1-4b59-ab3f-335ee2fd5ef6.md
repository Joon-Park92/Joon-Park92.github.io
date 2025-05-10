---
publish: true
uuid: e0a0fbf1-1ed1-4b59-ab3f-335ee2fd5ef6
---

<div markdown="1">

# 외로움은 어떻게 대처하면 좋을까 ?

<iframe width="560" height="315" src="https://www.youtube.com/embed/n3Xv_g3g-mA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## TL;DR

1. 외로움은 보편적인 감정임을 인지한다.
2. 의도를 해석할 때, 최대한 객관적으로 해석하는 연습을 하라. Bias 에 빠질 위험이 높다.
3. 필요한 만큼 Social Connection 을 만드는 연습을 의도적으로 시도하라.

## What is loneliness ?

Loneliness is bodily function like hunger. Your body needs social needs. It was a great indicator of how likely you were to survive. Natural selection rewarded our ancestors for collaboration, and for forming connections with each other.

- 2족 보행 인류는 약 4백만년 전
- 복잡한 문자 표현을 포함하는 정교한 활동을 하는 인류는 약 10만년 전
- 고릴라와 같은 영장류와 자손이 갈라진 것은 약 800만년 ~ 600만년 전
- 초기 인간 종은 약 15 ~ 20종이 있었음
- 초기 6백만 ~ 2백만년 전 인류 화석은 아프리카에서만 발견됨
    - 2 ~ 1.8 백만년 전에 아시아로
    - 1.5 ~ 1 백만년 전에 유럽으로
    - 오스트리아와 아메리카는 약 각각 6만년, 3만년 전 정도에 이주
- 농업과 문명의 시작은 약 1만 2천년 전

[Introduction to Human Evolution](https://humanorigins.si.edu/education/introduction-human-evolution)

[Loneliness Across Phylogeny and a Call for Comparative Studies and Animal Models - John T. Cacioppo, Stephanie Cacioppo, Steven W. Cole, John P. Capitanio, Luc Goossens, Dorret I. Boomsma, 2015](https://journals.sagepub.com/doi/full/10.1177/1745691614564876)

- That’s why rejections hurt, and even more so, why loneliness is so painful.

</div>

<div>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .axis path,
        .axis line {
            fill: none;
            shape-rendering: crispEdges;
        }
        .bar {
            fill: steelblue;
        }
        .bar:hover {
            fill: #2171b5;
        }
        .tooltip {
            position: absolute;
            text-align: center;
            width: 200px;
            height: auto;
            padding: 8px;
            font: 12px sans-serif;
            background: lightsteelblue;
            border: 1px solid #333;
            border-radius: 8px;
            pointer-events: none;
        }
    </style>
    <button id="toggleScale">Toggle Scale</button>
    <svg width="650" height="100" id="history-svg"></svg>
    <div class="tooltip" style="opacity: 0;"></div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // 데이터 정의
            const data = [
                { event: "Bipedal Hominins", yearsAgo: 4000000 },
                { event: "Complex Activities", yearsAgo: 100000 },
                { event: "Split from Gorillas", yearsAgoStart: 8000000, yearsAgoEnd: 6000000 },
                { event: "Early Human Species", yearsAgo: 1500000 },
                { event: "Migration to Asia", yearsAgo: 2000000 },
                { event: "Migration to Europe", yearsAgo: 1500000 },
                { event: "Migration to Australia", yearsAgo: 60000 },
                { event: "Migration to Americas", yearsAgo: 30000 },
                { event: "The Beginnings of Agriculture and Civilization", yearsAgo: 10000 },
            ];

            // SVG 설정
            const svg = d3.select("#history-svg"),
                  margin = {top: 20, right: 30, bottom: 40, left: 40},
                  width = +svg.attr("width") - margin.left - margin.right,
                  height = +svg.attr("height") - margin.top - margin.bottom;

            let isLogScale = true;

            const xLog = d3.scaleLog()
                .domain([10000, 8000000])
                .range([0, width]);

            const xLinear = d3.scaleLinear()
                .domain([0, 8000000])
                .range([0, width]);

            let x = xLog;

            const xAxis = d3.axisBottom(x)
                .tickFormat(d3.format(".0s"));

            const chart = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis);

            // 툴팁 설정
            const tooltip = d3.select(".tooltip");

            const bars = chart.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.yearsAgoEnd || d.yearsAgo))
                .attr("y", 0)
                .attr("width", d => (d.yearsAgoStart ? x(d.yearsAgoStart) - x(d.yearsAgoEnd) : 5))
                .attr("height", height / 2)
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(d.event + "<br/>" + (d.yearsAgoEnd ? `${d.yearsAgoStart / 1000000}M - ${d.yearsAgoEnd / 1000000}M` : `${d.yearsAgo / 1000}k`))
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // 스케일 토글 기능
            d3.select("#toggleScale").on("click", function() {
                isLogScale = !isLogScale;
                x = isLogScale ? xLog : xLinear;

                chart.select(".x.axis")
                    .transition()
                    .duration(1000)
                    .call(d3.axisBottom(x).tickFormat(d3.format(".0s")));

                bars.transition()
                    .duration(1000)
                    .attr("x", d => x(d.yearsAgoEnd || d.yearsAgo))
                    .attr("width", d => (d.yearsAgoStart ? x(d.yearsAgoStart) - x(d.yearsAgoEnd) : 5));
            });
        });
    </script>
</div>

<div markdown="1">

## The downside of the mordern world

- Intellecurals moved away from the colletivism of the Middle Ages, while the young Protestant theology stressed individual responsibility. This trend accelerated during the Industrial Revolution.
- Our bodies and minds are fundamentally the same they were 50,000 years ago. we are still biologically fine-tuned to being with each other.

## How loneliness kills

- Large scale studies have shown that the stress that comes from chronical loneliness is among the most unhealty things we can experience as humans.
- 외로움이 일상화되면 스스로를 방어적으로 만든다.
    - 지속되는 외로움은 사회적 신호에 대해 더 예민하고 경계하게 만드는데, 이것은 중립적인 신호조차 적대적으로 해석하도록 만든다.
    - 왜냐하면 고립된 환경에서 스스로를 지키기 위해서 그러하다.
    - 더 차갑고 친근하지 않도록 만든다.

## What can we do about it ?

- 악순환의 고리를 인지하는 것부터 시작해야한다.
- 가장 먼저 해야할 것은, 외로움은 보편적인 감정이며 부끄러워할 필요가 없다는 것이다.
- 부정적인 것을 과대해석하지 않았는지, 객관적으로 살펴보아야한다. 스스로 과대하게 부정적으로 해석하지는 않았는지 돌이켜보라.
- 스스로 사회적인 교류를 만들 기회를 없애지는 않았는지 생각해보라.
- 스스로 극복이 어렵다면, 전문가를 찾아가라. 이것은 약함을 보여주는 것이 아니라 당신의 용기를 보여주는 것이다.
- 사회적으로 연결될 수 있는 기회를 스스로 더 만들고, 그 능력의 근육을 키워라.
- 다음과 같은 두 책을 참조하였다. “EMOTIONAL FIRST AID, Guy Winch” / “Loneliness, John T. Cacioppo & William Patrick “

</div>