// 文件路径: src/ReadingPractice.jsx

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

// 🔥 2020-2024 全球考区高频真题精选库 (长篇完整版 + 题目)
const DATA_ARTICLES = [
    {
        id: 1,
        region: "🇨🇳 中国大陆考区",
        year: "2024",
        title: "Vertical Farming: The Future of Agriculture",
        content: `By 2050, it is estimated that 80% of the earth's population will reside in urban centres. Applying the most conservative estimates to current demographic trends, the human population will increase by about 3 billion people during the interim. An estimated 109 hectares of new land (about 20% more land than is represented by the country of Brazil) will be needed to grow enough food to feed them, if traditional farming methods continue as they are practiced today. At present, throughout the world, over 80% of the land that is suitable for raising crops is in use. Historically, some of our ancestors were justified in creating new farmland by banishing their forests. This practice is no longer a viable option.

The solution, suggested by many experts, is "Vertical Farming." Vertical farms, if designed properly, would eliminate the need to create additional farmland and could help restore ecosystem health. These multi-storey buildings would act as controlled environments for cultivating plant life. They would produce crops year-round, immune to weather irregularities, and would recycle up to 95% of the water used.

One major advantage of vertical farming is the potential for year-round crop production. Unlike traditional farming, which is heavily dependent on seasonal weather patterns, indoor vertical farms can control every aspect of the growing environment. This means that crops can be grown 24 hours a day, 365 days a year, regardless of external weather conditions. This reliability is crucial for food security in an increasingly unpredictable climate.

Furthermore, vertical farming significantly reduces the need for transportation. In the traditional model, produce is often shipped thousands of miles from the farm to the consumer, resulting in a large carbon footprint and a loss of freshness. Vertical farms, located in the heart of urban centers, can deliver produce to local markets and restaurants within hours of harvest. This "farm-to-table" approach not only ensures fresher food but also reduces greenhouse gas emissions associated with food transport.

However, the industry faces significant challenges. The most prominent is the high energy cost associated with artificial lighting and climate control. While LEDs have become more efficient, the energy required to replace the sun is substantial. Critics argue that unless vertical farms are powered by renewable energy sources, they may simply trade one environmental problem for another. Despite these hurdles, investment in the sector continues to grow, driven by the urgent need for sustainable food systems.`,
        questions: [
            {
                id: 1,
                type: "multiple_choice",
                question: "According to the passage, what percentage of the global population is expected to live in cities by 2050?",
                options: ["A. 20%", "B. 50%", "C. 80%", "D. 95%"],
                answer: "C"
            },
            {
                id: 2,
                type: "true_false",
                question: "Traditional farming methods will be sufficient to feed the population in 2050 without creating new farmland.",
                options: ["TRUE", "FALSE", "NOT GIVEN"],
                answer: "FALSE"
            },
            {
                id: 3,
                type: "multiple_choice",
                question: "What is a significant environmental benefit of vertical farming mentioned in the text?",
                options: [
                    "A. It eliminates the need for all pesticides.",
                    "B. It recycles up to 95% of the water used.",
                    "C. It requires zero electricity to run.",
                    "D. It produces crops only during the summer months."
                ],
                answer: "B"
            },
            {
                id: 4,
                type: "multiple_choice",
                question: "What is the main criticism levied against vertical farming?",
                options: [
                    "A. The food tastes worse than traditional crops.",
                    "B. It requires too much manual labor.",
                    "C. It has high energy costs due to artificial lighting.",
                    "D. It uses too much soil."
                ],
                answer: "C"
            }
        ],
        estimated_time: 1200
    },
    {
        id: 2,
        region: "🇪🇺 欧洲/英国考区",
        year: "2023",
        title: "The Psychology of Boredom",
        content: `We all know how it feels – it's impossible to keep your mind on anything, time stretches out, and all the things you could do seem equally unlikely to make you feel better. But defining boredom so that it can be studied in the lab has proved notoriously difficult. For a start, it can include a lot of other mental states, such as frustration, apathy, depression and indifference. There isn't even agreement over whether boredom is always a low-energy, flat kind of emotion or whether feeling agitated and restless counts as boredom, too.

In his book, "Boredom: A Lively History", Peter Toohey identifies a number of types of boredom. Simple boredom is the state of mind we experience when we are temporarily unavoidably stuck in a monotonous situation, like waiting for a delayed flight. This type is generally transient. Complex boredom, on the other hand, is a more existential state, where an individual feels a pervasive lack of meaning in life. This form is often linked to depression and can be chronic.

Psychologist Sandi Mann at the University of Central Lancashire, UK, goes further. 'All emotions are there for a reason, including boredom,' she says. Mann has found that being bored makes us more creative. 'We're all so afraid of being bored that we have constant entertainment at our fingertips – but it essentially wipes out a lot of opportunities for true imagination.' When we are bored, our brains search for neural stimulation. If we can't find it externally, we generate it internally, leading to daydreaming and creative thinking.

Experiments support this theory. In one study, participants who were asked to perform a boring task, like copying numbers from a phone book, subsequently performed better on a creative task than a control group. The boredom induced by the mundane activity appeared to prime their brains for creative problem-solving. This suggests that in our modern, hyper-connected world, we may be depriving ourselves of a vital source of creativity by constantly filling every spare moment with digital distractions.

However, boredom is not without its downsides. Chronic boredom is associated with a range of negative outcomes, including drug and alcohol abuse, overeating, and risk-taking behaviors. It seems that the human drive to escape boredom is so strong that some individuals will resort to harmful activities just to feel something. The challenge, then, is to find a balance—to embrace the occasional bout of simple boredom as a pause for the mind, while avoiding the depths of chronic, existential listlessness.`,
        questions: [
            {
                id: 1,
                type: "multiple_choice",
                question: "Why is defining boredom difficult for scientific study?",
                options: [
                    "A. Because it is a new concept.",
                    "B. Because it includes many other mental states like apathy and frustration.",
                    "C. Because people refuse to admit they are bored.",
                    "D. Because it only happens when people are alone."
                ],
                answer: "B"
            },
            {
                id: 2,
                type: "true_false",
                question: "Peter Toohey argues that there is only one single type of boredom.",
                options: ["TRUE", "FALSE", "NOT GIVEN"],
                answer: "FALSE"
            },
            {
                id: 3,
                type: "multiple_choice",
                question: "What positive effect of boredom did Sandi Mann's research highlight?",
                options: [
                    "A. It improves physical endurance.",
                    "B. It reduces the need for sleep.",
                    "C. It stimulates internal creativity and imagination.",
                    "D. It helps people make friends."
                ],
                answer: "C"
            },
            {
                id: 4,
                type: "true_false",
                question: "Participants who performed a boring task performed worse on a subsequent creative task.",
                options: ["TRUE", "FALSE", "NOT GIVEN"],
                answer: "FALSE"
            }
        ],
        estimated_time: 1200
    },
    {
        id: 3,
        region: "🇯🇵🇰🇷 日韩/亚太考区",
        year: "2023",
        title: "The Return of the Huia",
        content: `The Huia was a New Zealand bird species that has been extinct for over a century. However, it remains a potent symbol in Maori culture and New Zealand history. The female and male huia had dramatically different beak shapes, a trait unique among birds, which allowed them to cooperate in finding food. The male's stout beak was used to chisel into rotting wood, while the female's long, curved beak could probe deep into crevices to extract grubs. This sexual dimorphism is a classic example of niche differentiation.

The decline of the Huia began with the arrival of European settlers. Habitat loss due to deforestation for agriculture was a major factor, but the birds were also heavily hunted. Their distinct tail feathers were highly prized by Maori as symbols of rank, and later became fashionable in Europe, leading to rampant specimen collecting. By the early 20th century, the Huia had vanished from the forests of the North Island.

Recent scientific advancements have sparked discussions about "de-extinction" – using cloning technology to bring the Huia back. Proponents argue that restoring the bird would be a triumph for conservation and a correction of past human errors. They point to the success of other recovery programs and the rapid development of gene-editing tools like CRISPR.

However, critics in the Asia-Pacific scientific community raise ethical concerns. They argue that the ecosystem has changed significantly since the Huia's extinction. The old-growth forests they relied on are largely gone, and introduced predators like rats and stoats pose a constant threat. Introducing a species back into an environment that may no longer support it could lead to suffering for the animals or disruption of the current ecological balance.

Moreover, resources for conservation are limited. Opponents of de-extinction argue that funds would be better spent protecting critically endangered species that still exist, rather than attempting to resurrect those that are already lost. The debate continues as genetic mapping of museum specimens progresses, raising profound questions about our responsibility to the natural world and the limits of scientific intervention.`,
        questions: [
            {
                id: 1,
                type: "multiple_choice",
                question: "What was a unique physical characteristic of the Huia bird?",
                options: [
                    "A. They could fly backwards.",
                    "B. Males and females had dramatically different beak shapes.",
                    "C. They were the largest birds in New Zealand.",
                    "D. They had blue feathers."
                ],
                answer: "B"
            },
            {
                id: 2,
                type: "multiple_choice",
                question: "Why do some critics oppose bringing the Huia back?",
                options: [
                    "A. It is too expensive compared to other projects.",
                    "B. The ecosystem has changed and might not support them anymore.",
                    "C. The Maori people do not want the bird to return.",
                    "D. Cloning technology is currently illegal."
                ],
                answer: "B"
            },
            {
                id: 3,
                type: "true_false",
                question: "The Huia has been extinct for less than 50 years.",
                options: ["TRUE", "FALSE", "NOT GIVEN"],
                answer: "FALSE"
            },
            {
                id: 4,
                type: "multiple_choice",
                question: "What caused the decline of the Huia?",
                options: [
                    "A. Only habitat loss.",
                    "B. Only hunting for feathers.",
                    "C. A combination of habitat loss and hunting.",
                    "D. A disease introduced by European settlers."
                ],
                answer: "C"
            }
        ],
        estimated_time: 1200
    },
    {
        id: 4,
        region: "🇺🇸 北美考区",
        year: "2022",
        title: "The Development of the Telegraph",
        content: `Before the arrival of the telegraph, communication was limited by the speed of physical transportation. Whether by horse, ship, or train, a message could only travel as fast as the vehicle carrying it. The invention of the electric telegraph in the 19th century shattered this limitation, effectively detaching communication from transportation. It was the "Victorian Internet," a network that connected the world in real-time for the first time.

Samuel Morse is often credited with the invention, particularly for the code that bears his name. However, the development was a cumulative effort involving scientists from North America and Europe. In the UK, William Cooke and Charles Wheatstone developed a commercial telegraph system used for railway signalling. Meanwhile, in the US, Morse and his assistant Alfred Vail developed a single-wire system that proved more robust and efficient for long-distance communication. The first commercial telegraph line was established in 1844 between Washington D.C. and Baltimore.

The impact was profound. It transformed journalism, allowing news to travel instantaneously. It revolutionized business, enabling real-time stock market updates and centralized management of railroads. For the first time in history, the world began to shrink, laying the groundwork for the global communications network we rely on today. Governments could communicate with distant military outposts, and merchants could adjust prices based on international demand.

The expansion of the telegraph network was rapid. By the 1860s, a transcontinental line connected the East and West coasts of the United States, spelling the end for the Pony Express. Shortly after, the daring project to lay a transatlantic cable connected Europe and America. This feat of engineering involved overcoming immense technical challenges, including insulation failures and cable snapping mid-ocean. When it finally succeeded, it reduced the communication time between London and New York from weeks to minutes.`,
        questions: [
            {
                id: 1,
                type: "multiple_choice",
                question: "What was the main limitation of communication before the telegraph?",
                options: [
                    "A. The cost of paper.",
                    "B. The speed of physical transportation.",
                    "C. The lack of a common language.",
                    "D. The shortage of horses."
                ],
                answer: "B"
            },
            {
                id: 2,
                type: "true_false",
                question: "Samuel Morse was the only scientist involved in developing the telegraph technology.",
                options: ["TRUE", "FALSE", "NOT GIVEN"],
                answer: "FALSE"
            },
            {
                id: 3,
                type: "multiple_choice",
                question: "Which industry is NOT explicitly mentioned as being affected by the telegraph in the text?",
                options: [
                    "A. Journalism",
                    "B. Railroad management",
                    "C. Agriculture",
                    "D. Stock market"
                ],
                answer: "C"
            },
            {
                id: 4,
                type: "true_false",
                question: "The transatlantic cable reduced communication time from weeks to minutes.",
                options: ["TRUE", "FALSE", "NOT GIVEN"],
                answer: "TRUE"
            }
        ],
        estimated_time: 1200
    },
    {
        id: 5,
        region: "🇨🇳 中国大陆考区",
        year: "2021",
        title: "Traditional Chinese Glass",
        content: `While China is famous for its porcelain and ceramics, the history of glassmaking in the region is often overlooked. Recent archaeological discoveries suggest that glassmaking in China dates back to the Western Zhou period, much earlier than previously thought. This challenges the long-held belief that glass technology was brought to China solely from the West via the Silk Road.

Unlike the transparent glass favored in the Roman Empire, ancient Chinese glass was often opaque and colored, designed to mimic precious stones like jade. Jade held immense cultural and spiritual significance in ancient China, symbolizing purity and moral integrity. Glass bi disks and other ritual objects were created as cheaper alternatives to jade, used in burials and ceremonies.

The chemical composition of early Chinese glass, specifically the high levels of barium and lead, distinguishes it from the soda-lime glass produced in the Mediterranean. This unique composition suggests an independent origin of glassmaking technology in China, rather than it being solely an import from the West via the Silk Road. These findings are reshaping our understanding of technological exchange and innovation in the ancient world.

However, glass never achieved the same status as ceramics in Chinese culture. Porcelain, with its durability and aesthetic appeal, remained the dominant material for vessels and art. Glass was often regarded as a secondary material, interesting for its novelty but lacking the cultural weight of jade or the utility of ceramic. It wasn't until the Qing Dynasty, with the establishment of imperial glassworks and the influence of European missionaries, that Chinese glassmaking saw a renaissance, producing exquisite overlay glass and snuff bottles that are highly collected today.`,
        questions: [
            {
                id: 1,
                type: "multiple_choice",
                question: "What material was ancient Chinese glass primarily designed to mimic?",
                options: ["A. Gold", "B. Diamond", "C. Jade", "D. Silver"],
                answer: "C"
            },
            {
                id: 2,
                type: "multiple_choice",
                question: "What chemical elements distinguish ancient Chinese glass from Mediterranean glass?",
                options: [
                    "A. Soda and Lime",
                    "B. Barium and Lead",
                    "C. Carbon and Iron",
                    "D. Silicon and Oxygen"
                ],
                answer: "B"
            },
            {
                id: 3,
                type: "true_false",
                question: "Glass has always been more popular than ceramics in Chinese history.",
                options: ["TRUE", "FALSE", "NOT GIVEN"],
                answer: "FALSE"
            },
            {
                id: 4,
                type: "true_false",
                question: "Recent discoveries suggest glassmaking in China started earlier than previously thought.",
                options: ["TRUE", "FALSE", "NOT GIVEN"],
                answer: "TRUE"
            }
        ],
        estimated_time: 1200
    }
];

function ReadingPractice() {
    const [article, setArticle] = useState(null);
    const [userAnswers, setUserAnswers] = useState({}); 
    const [score, setScore] = useState(null); 
    const [isRunning, setIsRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0); 
    const timerRef = useRef(null); 

    // 计时器逻辑
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    useEffect(() => {
        selectRandomArticle();
    }, []);

    const selectRandomArticle = () => {
        const randomIndex = Math.floor(Math.random() * DATA_ARTICLES.length);
        setArticle(DATA_ARTICLES[randomIndex]);
        setTimeElapsed(0);
        setUserAnswers({});
        setScore(null);
        setIsRunning(true); 
    };

    const handleAnswerSelect = (questionId, option) => {
        if (score !== null) return;
        let answerValue = option;
        if (option.includes('.')) {
            answerValue = option.split('.')[0].trim();
        }
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answerValue
        }));
    };

    // 文件路径: src/ReadingPractice.jsx (替换 submitExam 函数)

const submitExam = async () => {
    setIsRunning(false); 
    
    let correctCount = 0;
    // ... (假设 questions 数组是完整的，且 userAnswers 已记录)
    article.questions.forEach(q => {
        if (userAnswers[q.id] === q.answer) {
            correctCount++;
        }
    });
    
    // 计算最终百分比得分 (例如：3/4题 = 75)
    const finalScore = Math.round((correctCount / article.questions.length) * 100);
    setScore({ correct: correctCount, total: article.questions.length, percent: finalScore });

    const user = (await supabase.auth.getSession()).data.session?.user;
    if (user) {
        // 🔥 关键修改：插入新的 accuracy_percent 列
        await supabase.from('reading_exercises').insert([{
            user_id: user.id,
            topic: `[${article.region}] ${article.title}`,
            duration_seconds: timeElapsed,
            accuracy_percent: finalScore, // <--- 新增行
        }]);
        alert(`交卷成功！得分: ${correctCount}/${article.questions.length} (准确率: ${finalScore}%)`);
    } else {
        alert(`交卷成功！(未登录，准确率: ${finalScore}%)`);
    }
};
    const formatTime = (s) => {
        return `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`;
    };

    const styles = {
        container: { maxWidth: '1200px', margin: '0 auto', padding: '20px', height: '85vh', display: 'flex', flexDirection: 'column' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '10px', background: '#ecf0f1', borderRadius: '8px' },
        workspace: { display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }, 
        articlePanel: { flex: 1, padding: '20px', background: '#f9f9f9', borderRadius: '8px', overflowY: 'auto', lineHeight: '1.8', fontSize: '16px', fontFamily: 'Georgia, serif' },
        questionPanel: { flex: 1, padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd', overflowY: 'auto' },
        questionBlock: { marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #eee' },
        optionLabel: { display: 'block', margin: '8px 0', cursor: 'pointer', padding: '5px', borderRadius: '4px' },
        selectedOption: { background: '#d5f5e3', border: '1px solid #2ecc71' },
        correctOption: { background: '#abebc6', fontWeight: 'bold' }, 
        wrongOption: { background: '#fadbd8', textDecoration: 'line-through' },
        button: { padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }
    };

    if (!article) return <div>加载中...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <strong>{article.region} ({article.year})</strong>
                    <h3 style={{margin: '5px 0'}}>{article.title}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: isRunning ? '#e74c3c' : '#2c3e50' }}>
                        {formatTime(timeElapsed)}
                    </div>
                    {score === null ? (
                        <button onClick={submitExam} style={{...styles.button, background: '#27ae60'}}>交卷 & 查看分数</button>
                    ) : (
                        <button onClick={selectRandomArticle} style={styles.button}>下一篇</button>
                    )}
                </div>
            </div>

            <div style={styles.workspace}>
                <div style={styles.articlePanel}>
                    {article.content.split('\n\n').map((para, idx) => (
                        <p key={idx}>{para}</p>
                    ))}
                </div>

                <div style={styles.questionPanel}>
                    {score !== null && (
                        <div style={{ padding: '15px', background: '#fdfefe', border: '1px solid #27ae60', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
                            <h3>最终得分: {score.correct} / {score.total}</h3>
                            <p>正确率: {score.percent}%</p>
                        </div>
                    )}

                    {article.questions.map((q, index) => {
                        const userAnswer = userAnswers[q.id];
                        const isCorrect = userAnswer === q.answer;

                        return (
                            <div key={q.id} style={styles.questionBlock}>
                                <p style={{ fontWeight: 'bold' }}>{index + 1}. {q.question}</p>
                                
                                {q.options.map((opt) => {
                                    let optVal = opt;
                                    if (opt.includes('.')) optVal = opt.split('.')[0].trim();
                                    
                                    const isSelected = userAnswer === optVal;
                                    let optionStyle = {};
                                    
                                    if (isSelected) optionStyle = { ...styles.selectedOption };

                                    if (score !== null) {
                                        if (optVal === q.answer) optionStyle = { ...styles.correctOption }; 
                                        if (isSelected && !isCorrect) optionStyle = { ...styles.wrongOption }; 
                                    }

                                    return (
                                        <label key={opt} style={{ ...styles.optionLabel, ...optionStyle }}>
                                            <input 
                                                type="radio" 
                                                name={`q-${q.id}`} 
                                                value={optVal}
                                                checked={isSelected}
                                                onChange={() => handleAnswerSelect(q.id, optVal)}
                                                disabled={score !== null} 
                                                style={{ marginRight: '10px' }}
                                            />
                                            {opt}
                                        </label>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ReadingPractice;