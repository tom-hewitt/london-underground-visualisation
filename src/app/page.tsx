import { AnimatedTubeMap } from "@/components/AnimatedTubeMap";
import { YearlyTubeMap } from "@/components/YearlyTubeMap";
import { fetchAllNumbatData } from "@/data/tube/numbat/fetch";
import { cabin } from "@/fonts";
import { cacheLife } from "next/cache";

export default async function Home() {
  "use cache";
  cacheLife("max");

  const numbatData = await fetchAllNumbatData();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        className={cabin.className}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "800px",
          paddingTop: "100px",
          paddingBottom: "100px",
          paddingLeft: "10px",
          paddingRight: "10px",
          gap: "20px",
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: "bold" }}>
          Visualising How Passengers Use the London Underground
        </h1>
        <EssayPart text={PART_1} />
        <div>
          <YearlyTubeMap numbatData={numbatData} />
          <em>Figure 1: Interactive Visualisation 1</em>
        </div>
        <EssayPart text={PART_2} />
        <div>
          <AnimatedTubeMap numbatData={numbatData} />
          <em>Figure 2: Interactive Visualisation 2</em>
        </div>
        <EssayPart text={PART_3} />
        <h2 style={{ fontSize: 20, fontWeight: "bold" }}>References</h2>
        <EssayPart text={REFERENCES} />
      </div>
    </div>
  );
}

function EssayPart({ text }: { text: string }) {
  return text.split("\n\n").map((pText) => <p>{pText}</p>);
}

const PART_1 = `The London Underground is one of the largest transit systems in the world, making 1.2 billion passenger journeys a year (Statista, 2024). It has grown massively in scale and complexity since it’s inception as the Metropolitan Railway in 1863, now consisting of 272 stations and 11 lines. Most recently, it has grown to include the Elizabeth Line - the result of almost 50 years of planning and around £20bn in investment (Topham, 2022).

Public transport investment has long been a political battlefield in the UK. High profile projects, most notably HS2, have been plagued by mismanagement and budget issues (Topham, 2025a). Unbalanced public transport investment has exacerbated regional divides, with the north of England receiving less than half the transport spending per-capita from 2012 to 2022, totalling to a £140bn deficit (Vinter, 2025). Public transport is about more than just getting from place A to B - it has wide-reaching downstream effects on accessibility, social mobility, the environment, quality of life, physical and mental health (Cooper et al., 2019), and productivity (Urban Transport Group, 2024).

Despite “decades of struggle” in its planning and development (Topham, 2022), the Elizabeth Line now accounts for 1 in 7 rail journeys in the country (Topham, 2025b), has set “a new standard for accessibility” with step-free access at all 41 stations (Brozek, 2023), and in 2024 won the prestigious RIBA Stirling prize for architecture. Oliver Wainwright, The Guardian’s architecture and design critic, pointed to the new line as proof that “Britain is still capable of pulling of gargantuan transport infrastructure projects with style and panache” (2024).

This essay, through data visualisation, highlights how people use the London Underground and how this has changed over recent years, and begins to explore the immediate and downstream effects of public transport investment, looking to the Elizabeth Line as a case study and as a model and advocate for future investment and planning.

Transport for London provides substantial amounts of publicly accessible data through its Open Data program to encourage businesses, developers, and academics to create new products and services to benefit Londoners (Deloitte, 2017). In particular, they provide the NUMBAT data set, a “comprehensive multi-rail demand data set”, which includes service ridership and frequency data down to each individual line link (TfL, 2024).

The NUMBAT is collated from ticketing data and gateline entry/exit totals across a large sample size to provide representative data for “a typical day in the autumn of each year (TfL, no date). The reason the data is processed to provide a view of a “typical” day is to prevent service disruptions, major events, or closures from affecting the data. Autumn is chosen as it is a “busier time of the year with more consistent travel patterns” (TfL, 2016). Whilst TfL (2016) warn that NUMBAT fluctuations may not necessarily reflect “whole-year annual demand changes” across the network as accurately as their annualised station entry/exit count data, it provides the most detailed view of how people use the network, as it shows their flow through each of the network’s links. Before visualising, I first preprocess that NUMBAT data to address some issues and inconsistencies. Notably, the data set combines the Hammersmith & City and Circle lines, which I address by dividing the load evenly between the lines as an approximation.

Another source of data I used for my visualisations was the TfL tube map vector graphic. This data includes more inconsistencies, such as multiple distinct stations being assigned the same acronym, which meant it wasn’t feasible to automatically extract all the station and link data from the graphic, making this a semi-manual process. Because of this, I decided to focus my efforts on Zone 1, since the majority of journeys pass through it. As future work, I would like to extend this to the entire network.`;

const PART_2 = `Perhaps the most immediately striking thing about my first visualisation (see figure 1) is the notable 2020 drop in ridership due to the COVID-19 pandemic. The 2020 sample window fell within the second national lockdown, when non-essential travel was disallowed. Essential journeys that were still allowed include those made for education and work that could not be done from home (Prime Minister’s Office, 2020).

Due to the pandemic, “many people lost trust” in public transport systems due to new awareness of the dangers of close proximity to others (Goodland and Potoglou, 2023). No longer were people only concerned about the discomfort of overcrowding, they were also worried about the potential health risk. This provides a possible explanation for the general network ridership not yet rebounding to its pre-pandemic levels. If this is the case, then perhaps the Elizabeth Line, with it’s reduced crowding due to larger, more frequent services, was perfectly placed to regain that lost trust.

According to Long, Carney, and Kandt (2023), “the pandemic appears to have amplified well-known social and geographical inequalities in transport”. Passengers from White ethnic backgrounds and affluent areas were less likely to use public transport, largely due to options for alternative transport or remote working. This lead to a decline in transport demand, motivating cuts in services, which would then further restrict the mobility of passengers who are predominantly young, non-White, or of lower socioeconomic status and don’t have the same alternative options available to them. It is therefore more important than ever to provide “attractive levels of public transport service”, such as the Elizabeth line, to prevent this vicious cycle.

The pandemic was also an opportunity to plan ahead for larger long-term change. Greg Marsden and Iain Docherty (2013) contended that transport policy thinking had long been dominated by “notions of habit and stability”, and that major disruptions make room for a “radical shift to a low carbon economy”. Indeed, when a major disruption did arrive in the form of the pandemic, the UK Parliament’s Inquiry Reforming public transport after the pandemic (2020) stated that it “could prove a unique opportunity to build a better, more sustainable transport system”.

The visualisation shows that the Elizabeth Line quickly became one of the lines with the highest ridership, approaching and then overtaking the Central line in terms of peak ridership. In fact, demand across all parallel lines has slightly decreased as demand for the Elizabeth line has increased (TfL, 2025), highlighting the potential for new transport developments to reduce crowding, thereby increasing comfort, across other services.

Whilst the majority of Elizabeth Line journeys are estimated to have shifted from other train lines, 38% are journeys that would have previously been made on another form of transport such as car or bus, or not made at all (TfL, 2025). This demonstrates the potential for environmental impacts, by reducing the number of people using less sustainable transport methods, and increased transport accessibility and mobility, by enabling journeys that may have been less feasible before.

Despite the NUMBAT dataset providing ridership data down to 15 minute intervals, for this visualisation I chose to look at average ridership in yearly intervals. This is because the goal of the visualisation is to show long term ridership trends, whereas more fine-grained intervals would primarily highlight less insightful short-term trends, like the fact that more people travel midweek.

The ridership data forms a weighted network: nodes represent stations, edges represent transport links, and each edge’s weight represents that link’s ridership. I decided that a node-link diagram, or some variation, was the most natural visualisation method. It’s worth noting that, in the case of the London Underground, each station may consist of multiple nodes that are displayed on the Tube map as an individual circles adjoined by a line.

An alternative visualisation option I considered was a conventional GIS visualisation using a tool such as ArcGIS. This is the approach taken by Oliver O’Brien’s Tube Heartbeat (2016), which shows ridership across the tube as blood flowing through a circulatory system. The contractions and relaxations over the 24 hour period reveal a distinct “pulse” that gives London it’s life - the rush of commuters at the start and end of the workday. O’Brien visualises links as overlapping straight lines of varying width over a detailed geographic map. I found that this approach, whilst serving perfectly well for the circulatory metaphor, lacked the intelligibility I wanted from my visualisation, suffering from the “hairball” effect (Rochat, 2015) that leads to the underlying data being obscured.

For a more intelligible visualisation, I chose to follow the principles established by Henry Beck, the forefather of the modern tube map (TfL, 2019). Beck’s approach, inspired by the circuit diagrams he encountered in his day job, “abandons” geography, favouring relative positions over absolute positions (Cartwright, 2014), and restricts itself to “octolinear” lines, meaning either horizontal, vertical, or at a 45 degree angle (Wu et al., 2020). Janin Hadlaw (2003) suggests that the particular success of Beck’s simplified, abstract design is because the visualisation is consistent with our experience as commuters - we think of travelling on the Underground in terms of directions, intersections, and sequences of stops, not necessarily concerned with our absolute geographical position other than at our ultimate destination.

Using the thickness of the lines as a visual variable was inspired by Charles Joseph Minard’s innovative depiction of Napoleon’s 1812 Russian campaign, which Edward Tufte (2001, p.40) suggested “may well be the best statistical graphic ever drawn”. Minard, like Beck, was an engineer by trade rather than a cartographer, and their work shares an “indifference to cartographic accuracy” (Corbett, 2001). This style of visualisation was later named after Captain Matthew Sankey, who used it to visualise the energy efficiency of a steam engine (Kennedy and Sankey, 1898). When compared to other visualisation methods, Sankey Diagrams are highly intelligible for visualising flow (Gutwin, Mairena and Bandi, 2023) - in my case the flow of riders through a public transport system.

A key factor in the intelligibility of both Beck’s Tube map and the Sankey diagram is the side-by-side arrangement of links arriving at the same node. Whilst Beck’s map deals with complex side-by-side links that each may traverse across multiple different octolinear corners, and Sankey diagrams deal with side-by-side links of varying widths, dealing with both of these elements simultaneously presented a unique technical challenge for my visualisation. Additionally, the links running side-by-side on the tube map may vary for each section of the link path, for example the Waterloo & City and Central lines, which only share a short section arriving at Bank. My approach was to further break down the links in the data set into individual straight-line sections, calculate an offset for each line on each link section based on its weight, and then calculate a Miter Joint (Verhoeff and Verhoeff, 2008) for each corner to find a point appropriately offset from the corner’s two adjacent sections.

M. Arcangelo Martiello’s Rush Hour Tube Map (2024b) also visualises side-by-side transport links using their width as a visual variable, representing the service frequency rather than ridership. Martiello’s visualisation is more faithful to Beck’s principles, however uses the author’s own station and line layout. The changes to the layout, while purporting readability benefits (Martiello, 2024a), come at a cost to decades of intuition and familiarity for commuters, and in my opinion ultimately distract from the data. For these reasons, I chose to stick as closely as possible to the established layout of the official tube map for my visualisations.

Familiarity with the official tube map also informed my choices for the colour hue visual variable - my visualisations use the exact colours as the established map. Nick Rougeux’s Global Subway Spectrum visualisation (2015) explores the colour systems used by different metro systems around the world, and highlights what John Elledge (2023) calls the “fifteen colour problem” - the “limit on the number of colours a map can comfortably contain” without reducing the eye’s ability to distinguish between them at a glance. To combat this, the TfL Tube map uses texture as an additional visual variable to differentiate between lines, including solid, hatched, and hollow lines.

I also use time as a visual variable to show how the network changes over a number of years, using an interactive slider to move between years, inspired by Hans Rosling’s interactive Gapminder World visualisation (2019). As my visualisation spans a number of years, some stations, nodes, and links are present in later years that didn’t exist in earlier years. I could have reorganised the map for earlier years to remove these elements, but visual changes to the map layout across the years as well as the data would have made it harder to make comparisons.

Another choice I had to make was whether or not to include the River Thames in my visualisation. I was initially concerned that the river would create visual clutter, potentially appearing at a glance like another Tube line. Indeed, TfL themselves held a similar opinion in 2009, prompting them to briefly remove the river from the map. This choice was marked with public outcry as Londoners lamented the loss of a “vital orienting point” (Barkham, 2009). Indeed, the river actually serves an important role as the sole geographical “anchor” in a map that otherwise eschews geography. To avoid visual confusion with the Tube lines, I gave a subtle, slightly transparent appearance in my visualisation.

It was necessary to store my data in a Vector format to allow the user to zoom in without the image getting pixelated, and to allow programmatic manipulation of the scale and shape of geometric objects for visualisation purposes, such as changing the widths and offsets of the Tube lines.
`;

const PART_3 = `Whilst my first visualisation focused on broader changes in the system over the course of many years, I also wanted to visualise the day-to-day commuter experience of using the London Underground.

Aiming for a more intuitive and “human” visualisation, I took inspiration Nathan Yau’s visualisation Years You Have Left to Live, Probably (2015), which visualises life expectancy statistics as a series of individual possible lifetime trajectories based on a probability distribution. Whereas the underlying data can be unintuitive, especially to non-specialists (Hullman, 2016), Yau presents the data in a way that better matches our experiences in everyday life.

Similarly, for my second visualisation (see figure 2), I visualise a series of possible journey trajectories based on the NUMBAT quarter-hourly service frequency data. Whilst there is not necessarily a fixed service timetable available for any of the days in the data set, since they represent not an actual historical day but a “typical” day, I created a model that estimates likely service times based on the service frequency for each link and its order within a given transit line.

To attempt to quantify the perceived quality of a public transport service, I introduce the seat load factor variable, defined as the number of people on a service relative to the number of seats (Banks, no date). From the commuter’s perspective, a lower seat load factor likely indicates better comfort. However, from a profitability, efficiency, and environmental perspective, the larger the seat load factor the better, so it is important to strike a balance between both perspectives.

Whereas my first visualisation only uses scale to represent a single variable (complete load), this visualisation encodes three separate but related variables in different aspects of the scale of each service. The width of the service represents the seat load factor of the service and the length encodes the capacity of the train. This means that the area of a service is naturally proportional to its complete load.

Whilst encoding this many variables could easily make a visualisation unintelligible, by using the visual metaphor of a moving train, it is designed to be compatible with the viewer’s internal thinking which, based on the findings of Ziemkiewicz and Kosara (2008), should assist with ease of understanding. The thicker lines in the visualisation naturally create the visual impression of a “bottleneck” where the services are overloaded. If my visualisation was static, the orientation may have caused the viewer to be confused between the length and width of a service, but the movement of the service makes this clearer, as the length runs parallel to movement and the width perpendicular.

I was surprised by the low circle line ridership shown by the first visualisation as, from my own day-to-day experiences, I perceive it to be one of the busier lines. The second visualisation better captures this perception, showing that, despite comparatively low ridership, the circle line actually has the highest peak seat load factor.

The visualisation shows that the seat load factor on the Elizabeth line remains at a healthy level of approximately 1 or less even at peak times, suggesting a high service quality and supporting TfL’s claim (2025) that, despite being the fourth busiest line, the Elizabeth line spends the least amount of time overcrowded. The ability to observe the service seat load factors, capacities, loads, and frequencies in a single visualisation makes it clear that this quality and comfort is due to larger trains and frequent services. Transport Focus (2015), an independent consumer watchdog that represents public transport users in the UK, found that having a seat factor of less than 1 (the ability to “get a seat”) is one of the key factors influencing passenger happiness, along with service reliability. This is reflected by the Elizabeth line’s 81% passenger satisfaction, which is the highest of all the London Underground lines (TfL, 2025).

In conclusion, the Elizabeth line has been an unprecedented success on multiple fronts in the few years since its opening, most notably in terms of ridership, accessibility, quality, and comfort. It has set a new standard for passenger happiness, adding to already positive changes public transport in general has been found to have for quality of life and both mental and physical health (Cooper et al., 2019).

The Elizabeth line also helped the transport industry attempt to rebound from the COVID pandemic, which imposed huge disruptions on the travel industry and threatened to have a lasting effect on it. In terms of transport policy thinking, we can look to the pandemic as a potential turning point, shifting from the dominant “habit and stability” mindset to larger bets on public transport that can have larger short- and long-term benefits.

Whilst it is too soon to fully quantify the long-term benefits of the Elizabeth Line, existing studies predict broader long-term benefits to the environment, social mobility, and regional productivity. There is room for future investigation in this area once the effects have time to become clearer.
`;

const REFERENCES = `Statista. (2024). Topic: London Underground: the Tube. [online] Available at: https://www.statista.com/topics/5092/london-underground-the-tube/?srsltid=AfmBOorjmC2NVlcfUGUG79Lc1SCGqQ7j0AkxCnonMh8VgeOsX0hokDPl#topicOverview [Accessed 26 Nov. 2025].

Topham, G. (2022). Elizabeth line: Crossrail complete after decades of struggle – a photo essay. [online] The Guardian. Available at: https://www.theguardian.com/uk-news/2022/may/23/building-the-elizabeth-line-london-tube [Accessed 13 Dec. 2025].

Topham, G. (2025a). HS2 ‘a casebook example of how not to run a major project’, MPs say. [online] the Guardian. Available at: https://www.theguardian.com/uk-news/2025/feb/28/hs2-a-casebook-example-of-how-not-to-run-a-major-project-mps-say [Accessed 28 Feb. 2025].

Vinter, R. (2025). North of England lost out on £140bn for transport in ‘decade of deceit’ – study. [online] the Guardian. Available at: https://www.theguardian.com/uk-news/2025/jun/09/north-of-england-lost-out-on-140bn-for-transport-in-decade-of-deceit-study [Accessed 21 Jun. 2025].

Cooper, E., Gates, S., Grollman, C., Mayer, M., Davis, B., Bankiewicz, U. and Khambhaita, P. (2019). Transport, health, and wellbeing: An evidence review for the Department of Transport. [online] Available at: https://assets.publishing.service.gov.uk/media/5dd6b167e5274a794517b633/Transport__health_and_wellbeing.pdf [Accessed 17 Dec. 2025].

Urban Transport Group (2024). The rail and urban transport review: An assessment and ambition for a new government. [online] Available at: https://www.urbantransportgroup.org/system/files/general-docs/Rail%20and%20urban%20government_FINAL.pdf [Accessed 17 Dec. 2025].

Topham, G. (2025b). A prize worth pursuing: has Elizabeth line shown what rail investment can achieve? [online] the Guardian. Available at: https://www.theguardian.com/business/2025/feb/21/elizabeth-line-prize-worth-pursuing-achieved-rail-investment.

Brozek, S. (2023). The Elizabeth Line Has Set a New Standard for Accessibility. New London Architecture. Available at: https://nla.london/news/the-elizabeth-line-has-set-a-new-standard-for-accessibility [Accessed 13 Dec. 2025].

Wainwright, O. (2024). ‘A triumph’: London’s £19bn Elizabeth line is named best new architecture in Britain. [online] the Guardian. Available at: https://www.theguardian.com/artanddesign/2024/oct/16/london-elizabeth-line-wins-stirling-prize-architecture [Accessed 13 Dec. 2025].
‌
Deloitte (2017). Assessing the value of TfL’s open data and digital partnerships. [online] Available at: https://content.tfl.gov.uk/deloitte-report-tfl-open-data.pdf [Accessed 17 Dec. 2025].

Transport for London (no date). Project NUMBAT. Available at: https://crowding.data.tfl.gov.uk/NUMBAT/Intro_to_NUMBAT.pdf [Accessed 26 Nov. 2025].

Transport for London (2016). NUMBAT 2016 Monday-Thursday. Available at: https://crowding.data.tfl.gov.uk/NUMBAT/NUMBAT 2016/NBT16MTT_Outputs.xlsx [Accessed 17 Dec. 2025]

Prime Minister’s Office (2020). Prime Minister announces new national restrictions. Available at: https://www.gov.uk/government/news/prime-minister-announces-new-national-restrictions [Accessed 16 Dec. 2025]

Goodland, F. and Dimitris Potoglou (2023). The resilience of public transport post-COVID: The case of Great Britain. Case Studies on Transport Policy, [online] 14, p.101088. doi:https://doi.org/10.1016/j.cstp.2023.101088.

Long, A., Carney, F. and Kandt, J. (2023). Who is returning to public transport for non-work trips after COVID-19? Evidence from older citizens’ smart cards in the UK’s second largest city region. Journal of Transport Geography, 107, pp.103529–103529. doi:https://doi.org/10.1016/j.jtrangeo.2023.103529.

Marsden, G. and Docherty, I. (2013). Insights on disruptions as opportunities for transport policy change. Transportation Research Part A: Policy and Practice, 51, pp.46–55. doi:https://doi.org/10.1016/j.tra.2013.03.004.

UK Parliament. Transport Committee (2020). Inquiry launch: Reforming public transport after the pandemic. Available at: https://committees.parliament.uk/committee/153/transport-committee/news/115143/inquiry-launch-reforming-public-transport-after-the-pandemic/ [Accessed: 16 Dec. 2025]

Transport for London (2025). Elizabeth line post-opening evaluation. [online] Available at: https://content.tfl.gov.uk/elizabeth-line-post-opening-evaluation-full-report.pdf [Accessed 17 Dec. 2025].

O’Brien, O. (2016). Tube Heartmap. [online] Available at: https://misc.oomap.co.uk/tubeheartbeat.com/london/ [Accessed 26 Nov. 2025].

Rochat, Y. (2015). Visualising Networks Part 1: A Critique. Available at: https://yro.ch/visualising-networks-part-1-a-critique/ [Accessed 16 Dec. 2025].

Transport for London (2019). Harry Beck’s Tube map. [online] Transport for London. Available at: https://tfl.gov.uk/corporate/about-tfl/culture-and-heritage/art-and-design/harry-becks-tube-map.

Wu, H., Niedermann, B., Takahashi, S., Roberts, M.J. and Nöllenburg, M. (2020). A Survey on Transit Map Layout – from Design, Machine, and Human Perspectives. Computer Graphics Forum, 39(3), pp.619–646. doi:https://doi.org/10.1111/cgf.14030.

Cartwright, W. (2014). Rethinking the definition of the word ‘map’: an evaluation of Beck’s representation of the London Underground through a qualitative expert survey. International Journal of Digital Earth, 8(7), pp.522–537. doi:https://doi.org/10.1080/17538947.2014.923942.

Hadlaw, J. (2003). The London Underground Map: Imagining Modern Time and Space. Design Issues, 19(1), pp.25–35. doi:https://doi.org/10.1162/074793603762667674.

Tufte, E.R. (2001). The Visual display of quantitative information. Cheshire, Conn.: Graphics Press, p.40.

Corbett, J. (2001). Charles Joseph Minard, Mapping Napoleon’s March. CSISS Classics. [online] Available at: https://web.archive.org/web/20030619011958/http://www.csiss.org/classics/content/58 [Accessed 13 Dec. 2025].

Kennedy, A.B.W. and Sankey, H.R. (1898). The Thermal Efficiency of Steam Engines. Minutes of the Proceedings of the Institution of Civil Engineers, 134(1898), pp.278–312. doi:https://doi.org/10.1680/imotp.1898.19100.

Gutwin, C., Mairena, A. and Bandi, V. (2023). Showing flow: Comparing usability of chord and sankey diagrams. [online] Hamburg, Germany: Association for Computing Machinery. doi:https://doi.org/10.1145/3544548.3581119.

Verhoeff, T. and Verhoeff, K.W. (2008). The mathematics of mitering and its artful application. In: Bridges Leeuwarden: Mathematical Connections in Art, Music, and Science, Proceedings of the Eleventh Annual Bridges Conference. [online] pp.225–234. Available at: http://www.win.tue.nl/~wstomv/publications/mathmitering-final.pdf.

Martiello, M.A. (2024a). Arcangelo’s Tube Map. [online] easytubemap.com. Available at: https://easytubemap.com/map/ [Accessed 13 Dec. 2025].

Martiello, M.A. (2024b). Rush Hour Map of the London Underground. Available at: https://easytubemap.com/download/7128/?tmstv=1719740537 [Accessed 13 Dec. 2025].

Rougeux, N. (2015). Global Subway Spectrum. [online] C82.net. Available at: https://www.c82.net/spectrum/ [Accessed 13 Dec. 2025].

Elledge, J. (2023). The fifteen colour problem. The Newsletter of (Not Quite) Everything. Available at: https://jonn.substack.com/p/the-fifteen-colour-problem [Accessed 13 Dec. 2025].

Rosling, H. (2019). Gapminder World. [online] Gapminder.org. Available at: https://www.gapminder.org/tools/.

Barkham, P. (2009). Where has my beloved Thames gone? [online] the Guardian. Available at: https://www.theguardian.com/artanddesign/2009/sep/17/london-new-tube-map-thames [Accessed 17 Dec. 2025].

Yau, N. (2015). Years You Have Left to Live, Probably. [online] FlowingData. Available at: https://flowingdata.com/2015/09/23/years-you-have-left-to-live-probably [Accessed 17 Dec. 2025].

Hullman, J. (2016). The Visual Uncertainty Experience, OpenVis Conf. 25th-26th April. Available at: https://www.youtube.com/watch?v=pTVAn4oLvbc [Accessed 17 Dec. 2025]

Banks, J.H. (no date). Analysis of Maximum Load Data for an Urban Bus System. Transportation Research Record, [online] 1011. Available at: https://onlinepubs.trb.org/Onlinepubs/trr/1985/1011/1011-001.pdf [Accessed 17 Dec. 2025].

Ziemkiewicz, C. and Kosara, R. (2008). The Shaping of Information by Visual Metaphors. IEEE Transactions on Visualization and Computer Graphics, [online] 14(6), pp.1269–1276. doi:https://doi.org/10.1109/tvcg.2008.171.

Transport Focus (2015). RPE0198 - Evidence on Improving rail passenger experience. [online] Parliament.uk. Available at: https://committees.parliament.uk/writtenevidence/68078/html/ [Accessed 17 Dec. 2025].`;
