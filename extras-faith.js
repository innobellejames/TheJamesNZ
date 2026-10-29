/* The James NZ — Faith & Hope: Saints & Martyrs, Faith Formation Library
   and Bible Dictionary (October 2026). Stories are original summaries.
   Portraits load from Wikipedia/Wikimedia Commons with a link to the source.
   Bible Dictionary: Easton's Bible Dictionary (1897) and Hitchcock's Bible
   Names (public domain), parsed by NEUU (CC BY 4.0). */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo;
  function ul(a) { return h('ul', null, a.map(function (x, i) { return h('li', { key: i }, x); })); }
  function ol(a) { return h('ol', null, a.map(function (x, i) { return h('li', { key: i }, x); })); }

  /* ======================= SAINTS & MARTYRS ======================= */
  // [name, feast MM-DD, category, patronage, story, Wikipedia title, martyr?]
  var S = [
    ['Mary, Mother of God', '01-01', 'Mary & the Holy Family', 'The Church; all Christians', 'A young Jewish woman of Nazareth, Mary said yes when the angel Gabriel asked her to become the mother of Jesus. She stayed faithful through joy and sorrow, from Bethlehem to the foot of the cross, and was with the apostles at Pentecost. Catholics honour her as Mother of God and mother of the Church.', 'Mary, mother of Jesus'],
    ['Joseph', '03-19', 'Mary & the Holy Family', 'Fathers, workers, the universal Church', 'A carpenter from Nazareth and the husband of Mary, Joseph protected and raised Jesus. The Gospels record no words he spoke, only what he did: he listened to God in dreams, took his family to safety in Egypt and worked to provide for them. He is also honoured as St Joseph the Worker on 1 May.', 'Saint Joseph'],
    ['Joachim and Anne', '07-26', 'Mary & the Holy Family', 'Grandparents', 'Tradition names Joachim and Anne as the parents of Mary and the grandparents of Jesus. They remind families that faith is handed on through ordinary love, prayer and example across generations.', 'Saint Anne'],
    ['John the Baptist', '06-24', 'Apostles & Bible saints', 'Baptism, those preparing for Christ', 'Cousin of Jesus, John lived simply in the desert and called people to turn back to God. He baptised Jesus in the Jordan and pointed others to him: “Behold the Lamb of God.” He was beheaded after speaking out against King Herod’s wrongdoing.', 'John the Baptist', 1],
    ['Peter', '06-29', 'Apostles & Bible saints', 'Popes, fishermen', 'A fisherman from Galilee, Peter was impulsive, loyal and sometimes afraid — he denied Jesus three times, then was forgiven and told three times to “feed my sheep.” He led the early Church and was crucified in Rome under Nero.', 'Saint Peter', 1],
    ['Paul', '06-29', 'Apostles & Bible saints', 'Missionaries, writers', 'Saul persecuted the first Christians until he met the risen Jesus on the road to Damascus. As Paul he travelled thousands of kilometres founding churches and wrote letters that make up much of the New Testament. He was beheaded in Rome.', 'Paul the Apostle', 1],
    ['Andrew', '11-30', 'Apostles & Bible saints', 'Scotland, fishermen', 'Peter’s brother Andrew was a follower of John the Baptist before he followed Jesus — and immediately brought his brother to meet him. Tradition says he was martyred on an X-shaped cross, which appears on the flag of Scotland.', 'Andrew the Apostle', 1],
    ['James the Greater', '07-25', 'Apostles & Bible saints', 'Pilgrims, Spain', 'One of the first disciples called, James was with Jesus at the Transfiguration and in Gethsemane. He was the first apostle to be martyred, in Jerusalem. The great pilgrimage route, the Camino de Santiago, leads to his shrine in Spain.', 'James the Great', 1],
    ['John the Apostle', '12-27', 'Apostles & Bible saints', 'Friendship, writers', 'Called “the disciple whom Jesus loved,” John stood at the cross, where Jesus entrusted Mary to his care. The Gospel and letters that bear his name speak again and again of love: “God is love.”', 'John the Apostle'],
    ['Thomas', '07-03', 'Apostles & Bible saints', 'India, those who doubt', 'Thomas would not believe in the resurrection until he could see and touch — then said the strongest words of faith in the Gospels: “My Lord and my God!” Tradition says he carried the Gospel to India, where Christians still call themselves Saint Thomas Christians.', 'Thomas the Apostle', 1],
    ['Matthew', '09-21', 'Apostles & Bible saints', 'Accountants, tax collectors', 'Matthew was a tax collector, an unpopular job, when Jesus said, “Follow me.” He left his table at once and later threw a dinner for Jesus and his friends. The first Gospel is named after him.', 'Matthew the Apostle', 1],
    ['Bartholomew', '08-24', 'Apostles & Bible saints', 'Tanners, those with skin conditions', 'Often identified with Nathanael, whom Jesus called “a man without deceit.” Tradition says he preached in Armenia and was martyred there.', 'Bartholomew the Apostle', 1],
    ['Philip and James the Less', '05-03', 'Apostles & Bible saints', 'Uruguay (both); pharmacists (James)', 'Philip brought Nathanael to Jesus and asked, “Show us the Father.” James, son of Alphaeus, is often identified with James who led the Church in Jerusalem. Both are honoured as apostles and martyrs.', 'Philip the Apostle', 1],
    ['Simon and Jude', '10-28', 'Apostles & Bible saints', 'Jude: hopeless causes', 'Simon “the Zealot” and Jude (also called Thaddeus) are thought to have preached together and been martyred in Persia. St Jude is invoked by people in desperate situations.', 'Jude the Apostle', 1],
    ['Matthias', '05-14', 'Apostles & Bible saints', 'Recovering alcoholics, tailors', 'After the resurrection the apostles chose Matthias by lot to take the place of Judas. He had followed Jesus from the time of John’s baptism.', 'Saint Matthias', 1],
    ['Barnabas', '06-11', 'Apostles & Bible saints', 'Peacemakers, Cyprus', 'His name means “son of encouragement.” Barnabas sold his field for the poor, vouched for Paul when others were afraid of him, and travelled with him on the first missionary journey.', 'Barnabas', 1],
    ['Mark', '04-25', 'Apostles & Bible saints', 'Lawyers, Venice', 'Mark wrote the shortest and probably earliest Gospel. Tradition links him with Peter in Rome and with the founding of the Church in Alexandria. His symbol is a lion.', 'Mark the Evangelist', 1],
    ['Luke', '10-18', 'Apostles & Bible saints', 'Doctors, artists', 'A physician and companion of Paul, Luke wrote a Gospel and the Acts of the Apostles. His Gospel gives us the Christmas story, the Good Samaritan and the Prodigal Son, and shows special care for the poor and for women.', 'Luke the Evangelist'],
    ['Mary Magdalene', '07-22', 'Apostles & Bible saints', 'Converts, women', 'A follower of Jesus who stayed at the cross when most disciples fled, Mary Magdalene was the first to meet the risen Lord and to tell the others. The Church calls her “apostle to the apostles.”', 'Mary Magdalene'],
    ['Martha, Mary and Lazarus', '07-29', 'Apostles & Bible saints', 'Martha: cooks, homemakers, hospitality', 'Close friends of Jesus in Bethany. Busy Martha served, Mary listened, and Jesus raised their brother Lazarus from the dead. Martha’s faith shines out: “I believe that you are the Christ.”', 'Martha'],
    ['Stephen', '12-26', 'Martyrs', 'Deacons, stonemasons', 'One of the first seven deacons, chosen to care for widows and the poor. Stephen was stoned to death for his faith, praying, “Lord, do not hold this sin against them” — the Church’s first martyr.', 'Saint Stephen', 1],
    ['The Holy Innocents', '12-28', 'Martyrs', 'Babies, children', 'The young boys of Bethlehem killed on King Herod’s orders when he tried to destroy the newborn Jesus. They are remembered as martyrs who died in Christ’s place.', 'Massacre of the Innocents', 1],
    ['Ignatius of Antioch', '10-17', 'Martyrs', 'The Church in the Eastern Mediterranean', 'A bishop who was taken to Rome to die in the arena around the year 108. On the way he wrote seven letters to churches, urging unity around their bishop and the Eucharist. He called himself “God’s wheat.”', 'Ignatius of Antioch', 1],
    ['Polycarp', '02-23', 'Martyrs', 'Against earache (tradition)', 'Bishop of Smyrna and a disciple of John the Apostle. Told to curse Christ at age 86, he replied, “For eighty-six years I have served him, and he has done me no wrong.” He was burned at the stake around 155.', 'Polycarp', 1],
    ['Justin Martyr', '06-01', 'Martyrs', 'Philosophers, apologists', 'A philosopher who searched many schools before finding the truth in Christ. Justin explained the faith to pagans and gave one of the earliest descriptions of the Mass. He was beheaded in Rome around 165.', 'Justin Martyr', 1],
    ['Perpetua and Felicity', '03-07', 'Martyrs', 'Mothers, expectant mothers', 'A young noblewoman and her pregnant slave, both new Christians, were martyred together in Carthage in 203. Perpetua’s own prison diary survives, one of the earliest writings by a Christian woman.', 'Perpetua and Felicity', 1],
    ['Cornelius and Cyprian', '09-16', 'Martyrs', 'Cornelius: earache; Cyprian: North Africa', 'Pope Cornelius and Bishop Cyprian of Carthage defended mercy for Christians who had lapsed under persecution, and both died in exile or martyrdom in the 250s.', 'Pope Cornelius', 1],
    ['Lawrence', '08-10', 'Martyrs', 'Cooks, the poor, deacons', 'A deacon of Rome who cared for the poor. When ordered to hand over the Church’s treasures, he gathered the city’s poor and said, “Here are the treasures of the Church.” He was martyred in 258.', 'Saint Lawrence', 1],
    ['Agnes', '01-21', 'Martyrs', 'Girls, young people', 'A Roman girl of about twelve who refused to give up her faith and was martyred around 304. Her name sounds like the Latin for lamb, so she is often shown with one.', 'Agnes of Rome', 1],
    ['Agatha', '02-05', 'Martyrs', 'Sicily, those with breast cancer, against fire', 'A young Christian woman of Sicily who refused to give up her faith or her vow, and was tortured and martyred around 251.', 'Saint Agatha', 1],
    ['Lucy', '12-13', 'Martyrs', 'The blind, those with eye conditions', 'A young woman of Syracuse who gave her dowry to the poor and was martyred in 304. Her name means light, and her feast in the darkest part of the northern winter is kept with candles.', 'Saint Lucy', 1],
    ['Cecilia', '11-22', 'Martyrs', 'Musicians, singers', 'A Roman martyr of the early centuries, said to have “sung in her heart to the Lord.” She is honoured as patron of church music.', 'Saint Cecilia', 1],
    ['George', '04-23', 'Martyrs', 'England, soldiers, scouts', 'A soldier martyred around 303 for refusing to give up his faith. The later legend of George slaying a dragon became a picture of courage against evil.', 'Saint George', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Novgorod_George.jpg/500px-Novgorod_George.jpg'],
    ['Blaise', '02-03', 'Martyrs', 'Throat illnesses', 'A bishop and physician in Armenia, said to have saved a boy choking on a fish bone. Throats are blessed with two crossed candles on his feast.', 'Saint Blaise', 1],
    ['Catherine of Alexandria', '11-25', 'Martyrs', 'Students, philosophers', 'Remembered as a brilliant young woman who debated pagan scholars and won them to Christ, and was martyred in the early 300s.', 'Catherine of Alexandria', 1],
    ['Boniface', '06-05', 'Martyrs', 'Germany, brewers', 'An English monk who became the “apostle of Germany,” felling the sacred oak of Thor to show it had no power. He was martyred in 754 while preparing people for confirmation.', 'Saint Boniface', 1],
    ['Stanislaus', '04-11', 'Martyrs', 'Poland, Kraków', 'Bishop of Kraków who challenged King Bolesław over his cruelty and was killed while celebrating Mass in 1079.', 'Stanislaus of Szczepanów', 1],
    ['Thomas Becket', '12-29', 'Martyrs', 'Clergy, Exeter College Oxford', 'Archbishop of Canterbury who defended the Church’s freedom against King Henry II and was murdered in his cathedral in 1170.', 'Thomas Becket', 1],
    ['John Fisher and Thomas More', '06-22', 'Martyrs', 'Lawyers, politicians (More)', 'A bishop and a lawyer-statesman who refused to accept Henry VIII as head of the Church in England. Both were beheaded in 1535. More said he died “the King’s good servant, but God’s first.”', 'Thomas More', 1],
    ['Paul Miki and Companions', '02-06', 'Martyrs', 'Japan', 'Twenty-six Catholics — Japanese and European, priests, brothers and lay people, including children — were crucified at Nagasaki in 1597. Paul Miki preached forgiveness from his cross.', 'Paul Miki', 1],
    ['Lorenzo Ruiz', '09-28', 'Martyrs', 'The Philippines, Filipino workers overseas', 'A husband and father from Manila who fled to Japan and was martyred at Nagasaki in 1637. He said he would have given a thousand lives for God. He is the first Filipino saint.', 'Lorenzo Ruiz', 1],
    ['Andrew Kim Taegon and Companions', '09-20', 'Martyrs', 'Korea', 'Andrew Kim was the first Korean-born priest. He and 102 companions, mostly lay people, died for their faith in the nineteenth century, in a Church founded and kept alive largely by lay Catholics.', 'Andrew Kim Tae-gon', 1],
    ['Andrew Dung-Lac and Companions', '11-24', 'Martyrs', 'Vietnam', 'One hundred and seventeen martyrs of Vietnam from the 1700s and 1800s — priests, catechists, parents and soldiers — honoured together for their faithfulness under persecution.', 'Vietnamese Martyrs', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Saint_Paul_Catholic_Church_%28Westerville%2C_Ohio%29_-_Saint_Andrew_Dung_Lac.jpg/500px-Saint_Paul_Catholic_Church_%28Westerville%2C_Ohio%29_-_Saint_Andrew_Dung_Lac.jpg'],
    ['Charles Lwanga and Companions', '06-03', 'Martyrs', 'Africa, young people', 'Young pages at the royal court of Buganda (Uganda) who refused the king’s abuse and would not give up their faith. Twenty-two Catholics were killed in 1885–87 alongside Anglican martyrs.', 'Charles Lwanga', 1],
    ['Peter Chanel', '04-28', 'Oceania & Aotearoa', 'Oceania', 'A French Marist priest who came to the island of Futuna, between Fiji and Samoa. He served with gentleness, learning the language and caring for the sick, and was killed in 1841 — the first martyr of Oceania. Within a few years, the island became Catholic.', 'Peter Chanel', 1],
    ['Peter To Rot', '07-07', 'Oceania & Aotearoa', 'Papua New Guinea, catechists, married couples', 'A catechist, husband and father from Papua New Guinea who kept the faith alive during the Second World War when priests were imprisoned. He defended Christian marriage, was arrested and killed in 1945. He was canonised in 2025.', 'Peter To Rot', 1],
    ['Mary MacKillop', '08-08', 'Oceania & Aotearoa', 'Australia, educators', 'Co-founder of the Sisters of St Joseph, Mary MacKillop opened schools for poor children across Australia and New Zealand, where the Josephite sisters began working in 1883. She was canonised in 2010, Australia’s first saint.', 'Mary MacKillop'],
    ['Damien of Molokai', '05-10', 'Oceania & Aotearoa', 'People with leprosy (Hansen’s disease), Hawaii', 'A Belgian priest who chose to live among people exiled with leprosy on the Hawaiian island of Molokai. He built homes, churches and coffins, caught the disease himself, and died in 1889.', 'Father Damien'],
    ['Suzanne Aubert (Venerable)', '10-01', 'Oceania & Aotearoa', 'A cause for sainthood is open', 'A French sister who spent most of her life in Aotearoa. She learned te reo Māori, made herbal medicines, founded the Sisters of Compassion and cared for the sick, the poor and abandoned children in Hiruharama and Wellington. She died in 1926 and was declared Venerable in 2016. (Her cause continues; she is not yet canonised. 1 October is the anniversary of her death.)', 'Suzanne Aubert'],
    ['Marcellin Champagnat', '06-06', 'Oceania & Aotearoa', 'Marist Brothers, teachers', 'A French priest who founded the Marist Brothers in 1817 to educate young people. Marist schools have taught generations of New Zealanders.', 'Marcellin Champagnat'],
    ['Basil the Great and Gregory Nazianzen', '01-02', 'Doctors of the Church', 'Basil: hospital administrators', 'Two close friends and bishops in Cappadocia (in modern Türkiye) in the 300s. They explained the Church’s faith in the Holy Trinity, and Basil built a city of care for the sick and poor.', 'Basil of Caesarea'],
    ['Athanasius', '05-02', 'Doctors of the Church', 'Theologians', 'Bishop of Alexandria who defended the truth that Jesus is fully God against the Arian heresy. He was exiled five times but never gave up.', 'Athanasius of Alexandria'],
    ['Ephrem', '06-09', 'Doctors of the Church', 'Spiritual directors', 'A deacon in Syria known as the “Harp of the Holy Spirit.” He taught the faith through hundreds of beautiful hymns and served the hungry during a famine.', 'Ephrem the Syrian'],
    ['Cyril of Jerusalem', '03-18', 'Doctors of the Church', 'Catechists', 'Bishop of Jerusalem whose clear talks to new Christians preparing for baptism are still read today.', 'Cyril of Jerusalem'],
    ['John Chrysostom', '09-13', 'Doctors of the Church', 'Preachers', 'His name means “golden mouth.” Archbishop of Constantinople, he preached powerfully about caring for the poor and was exiled for criticising the powerful.', 'John Chrysostom'],
    ['Ambrose', '12-07', 'Doctors of the Church', 'Milan, beekeepers', 'A Roman governor who was acclaimed bishop of Milan before he was even baptised. He wrote hymns, stood up to the emperor, and baptised Augustine.', 'Ambrose'],
    ['Jerome', '09-30', 'Doctors of the Church', 'Translators, librarians', 'A scholar with a sharp temper who translated the Bible into Latin (the Vulgate). He said, “Ignorance of Scripture is ignorance of Christ.”', 'Jerome'],
    ['Augustine', '08-28', 'Doctors of the Church', 'Theologians, brewers', 'After a restless youth, Augustine was converted through Scripture, Ambrose’s preaching and his mother Monica’s prayers. As bishop of Hippo he wrote the Confessions: “Our heart is restless until it rests in you.”', 'Augustine of Hippo'],
    ['Leo the Great', '11-10', 'Doctors of the Church', 'Teachers of the faith', 'A pope who taught clearly that Jesus is one person, truly God and truly man, and who met Attila the Hun in 452 and persuaded him to turn back from Rome.', 'Pope Leo I'],
    ['Gregory the Great', '09-03', 'Doctors of the Church', 'Teachers, musicians', 'A pope who organised food for the hungry of Rome, sent missionaries to England and called himself “servant of the servants of God.” Gregorian chant is named after him.', 'Pope Gregory I'],
    ['Bede the Venerable', '05-25', 'Doctors of the Church', 'Historians, scholars', 'An English monk whose Ecclesiastical History of the English People is a foundation of English history. He popularised dating years from the birth of Christ (AD).', 'Bede'],
    ['Anselm', '04-21', 'Doctors of the Church', 'Philosophers', 'Archbishop of Canterbury who described theology as “faith seeking understanding.”', 'Anselm of Canterbury'],
    ['Bernard of Clairvaux', '08-20', 'Doctors of the Church', 'Beekeepers, Cistercians', 'A monk whose preaching and writing on the love of God spread the Cistercian order across Europe.', 'Bernard of Clairvaux'],
    ['Hildegard of Bingen', '09-17', 'Doctors of the Church', 'Musicians, scientists', 'A German abbess who composed music, wrote on medicine and natural science, and described visions of God’s light. She was named a Doctor of the Church in 2012.', 'Hildegard of Bingen'],
    ['Thomas Aquinas', '01-28', 'Doctors of the Church', 'Students, schools, universities', 'A quiet Dominican friar nicknamed “the dumb ox” by classmates, Thomas became one of the greatest thinkers in history. His Summa Theologiae shows how faith and reason work together.', 'Thomas Aquinas'],
    ['Bonaventure', '07-15', 'Doctors of the Church', 'Theologians', 'A Franciscan theologian and leader who wrote about the journey of the mind to God.', 'Bonaventure'],
    ['Anthony of Padua', '06-13', 'Doctors of the Church', 'Lost things, the poor', 'A Portuguese Franciscan famed for his preaching and knowledge of Scripture. People still ask his help to find lost things.', 'Anthony of Padua'],
    ['Catherine of Siena', '04-29', 'Doctors of the Church', 'Italy, Europe, nurses', 'A young laywoman who cared for the sick and dying, wrote fearless letters to popes and helped bring the papacy back to Rome from Avignon. She died at 33.', 'Catherine of Siena'],
    ['Teresa of Ávila', '10-15', 'Doctors of the Church', 'Headache sufferers, Spain', 'A lively Carmelite nun who reformed her order and taught that prayer is “a close sharing between friends.” Her Interior Castle maps the soul’s journey to God.', 'Teresa of Ávila'],
    ['John of the Cross', '12-14', 'Doctors of the Church', 'Mystics, poets', 'A Carmelite friar and poet who worked with Teresa of Ávila. Imprisoned by his own brothers, he wrote poems such as The Dark Night of the Soul.', 'John of the Cross'],
    ['Francis de Sales', '01-24', 'Doctors of the Church', 'Writers, journalists', 'A gentle bishop of Geneva who taught that holiness is for everyone, in every walk of life. His Introduction to the Devout Life is still popular.', 'Francis de Sales'],
    ['Alphonsus Liguori', '08-01', 'Doctors of the Church', 'Confessors, moral theologians', 'A lawyer who became a priest, founded the Redemptorists and wrote about God’s mercy for ordinary people.', 'Alphonsus Liguori'],
    ['Irenaeus', '06-28', 'Doctors of the Church', 'Lyon, unity', 'Bishop of Lyon in the 100s who defended the Gospel against false teaching: “The glory of God is a human being fully alive.” Named a Doctor of the Church in 2022.', 'Irenaeus'],
    ['Thérèse of Lisieux', '10-01', 'Doctors of the Church', 'Missions, florists', 'A young Carmelite nun who died at 24. Her “little way” — doing small things with great love — and her autobiography Story of a Soul made her one of the best-loved saints.', 'Thérèse of Lisieux'],
    ['John Henry Newman', '10-09', 'Doctors of the Church', 'Catholic education', 'An English scholar and Anglican priest who became Catholic in 1845 and later a cardinal. He wrote about conscience, education and the development of doctrine, and was named a Doctor of the Church in 2025.', 'John Henry Newman'],
    ['Anthony the Abbot', '01-17', 'Religious founders', 'Animals, farmers', 'An Egyptian who gave away his wealth to pray in the desert, Anthony became the father of monks. People travelled to him for wisdom.', 'Anthony the Great'],
    ['Benedict', '07-11', 'Religious founders', 'Europe, students', 'Founder of Western monasticism. His Rule — “pray and work” — shaped monasteries that kept learning and faith alive in Europe.', 'Benedict of Nursia'],
    ['Scholastica', '02-10', 'Religious founders', 'Nuns, against storms', 'Twin sister of Benedict and founder of a community of nuns. Once she prayed for a storm so that her brother would stay longer to talk about God.', 'Scholastica'],
    ['Patrick', '03-17', 'Religious founders', 'Ireland, Auckland’s cathedral', 'Kidnapped from Britain as a teenager and enslaved in Ireland, Patrick escaped, became a priest and returned to bring the Gospel to the people who had enslaved him. Auckland’s cathedral is dedicated to St Patrick and St Joseph.', 'Saint Patrick'],
    ['Dominic', '08-08', 'Religious founders', 'Astronomers, preachers', 'A Spanish priest who founded the Order of Preachers (Dominicans) to teach the faith through study, prayer and preaching.', 'Saint Dominic'],
    ['Francis of Assisi', '10-04', 'Religious founders', 'Animals, ecology, Italy', 'A rich young man who gave everything away to live simply like Jesus. He loved the poor and all creation, wrote the Canticle of the Creatures and founded the Franciscans.', 'Francis of Assisi'],
    ['Clare of Assisi', '08-11', 'Religious founders', 'Television, eye conditions', 'Inspired by Francis, Clare founded the Poor Clares, a community of sisters devoted to prayer and simple living.', 'Clare of Assisi'],
    ['Ignatius of Loyola', '07-31', 'Religious founders', 'Retreats, soldiers', 'A Spanish soldier injured by a cannonball, Ignatius read about Christ and the saints while recovering and changed his life. He founded the Jesuits and wrote the Spiritual Exercises.', 'Ignatius of Loyola'],
    ['Francis Xavier', '12-03', 'Religious founders', 'Missions, missionaries', 'One of the first Jesuits, he carried the Gospel to India, Southeast Asia and Japan, and died trying to reach China in 1552.', 'Francis Xavier'],
    ['Philip Neri', '05-26', 'Religious founders', 'Joy, comedians, Rome', 'A cheerful priest of Rome known for his humour. He founded the Oratory and used music and friendship to draw people to God.', 'Philip Neri'],
    ['Vincent de Paul', '09-27', 'Religious founders', 'Charities, the St Vincent de Paul Society', 'A French priest who organised care for the poor, prisoners and orphans and founded the Daughters of Charity. The St Vincent de Paul Society, active in New Zealand parishes, is named after him.', 'Vincent de Paul'],
    ['John Baptist de La Salle', '04-07', 'Religious founders', 'Teachers', 'A French priest who founded the De La Salle Brothers and pioneered free schools and teacher training.', 'Jean-Baptiste de La Salle'],
    ['John Bosco', '01-31', 'Religious founders', 'Young people, students', 'A priest in Turin who gathered street boys, gave them education and work, and founded the Salesians. He taught that teaching works best through kindness and joy.', 'John Bosco'],
    ['Elizabeth Ann Seton', '01-04', 'Religious founders', 'Catholic schools, widows', 'A widowed mother of five who became Catholic and founded the Sisters of Charity in the United States. The first US-born saint.', 'Elizabeth Ann Seton'],
    ['Frances Xavier Cabrini', '11-13', 'Religious founders', 'Immigrants', 'An Italian sister who crossed the Atlantic many times to found schools, orphanages and hospitals for migrants in the Americas.', 'Frances Xavier Cabrini'],
    ['Bridget of Sweden', '07-23', 'Religious founders', 'Europe, widows', 'A wife, mother of eight and later founder of a religious order, Bridget wrote down revelations about the Passion of Christ.', 'Bridget of Sweden'],
    ['Rita of Cascia', '05-22', 'Modern & beloved saints', 'Impossible causes, difficult marriages', 'Rita endured a hard marriage, forgave her husband’s killers and later became an Augustinian nun. She is invoked in seemingly impossible situations.', 'Rita of Cascia'],
    ['Joan of Arc', '05-30', 'Modern & beloved saints', 'France, soldiers', 'A teenage peasant girl who believed God called her to lead French forces. Captured and burned at the stake at nineteen in 1431, she was later declared innocent and a saint.', 'Joan of Arc', 1],
    ['Aloysius Gonzaga', '06-21', 'Modern & beloved saints', 'Young people, students', 'An Italian noble who became a Jesuit and died at 23 after caring for plague victims in Rome in 1591.', 'Aloysius Gonzaga'],
    ['Rose of Lima', '08-23', 'Modern & beloved saints', 'Latin America, gardeners', 'A young woman of Lima, Peru, who lived a life of prayer and cared for the sick and poor in her family home. The first canonised saint of the Americas.', 'Rose of Lima'],
    ['Martin de Porres', '11-03', 'Modern & beloved saints', 'Social justice, people of mixed race', 'The son of a Spanish nobleman and a freed African woman, Martin was a Dominican brother in Lima who cared for the sick, the poor and even stray animals.', 'Martin de Porres'],
    ['Martin of Tours', '11-11', 'Modern & beloved saints', 'Soldiers, the poor', 'A Roman soldier who cut his cloak in half for a freezing beggar, then dreamed Christ was wearing it. He became a much-loved bishop.', 'Martin of Tours'],
    ['Nicholas', '12-06', 'Modern & beloved saints', 'Children, sailors', 'A bishop of Myra known for secret gifts to people in need. His legend grew into Santa Claus.', 'Saint Nicholas'],
    ['Elizabeth of Hungary', '11-17', 'Modern & beloved saints', 'Bakers, hospitals', 'A princess who used her wealth to feed the hungry and built a hospital, then served the sick herself. She died at 24.', 'Elizabeth of Hungary'],
    ['Margaret of Scotland', '11-16', 'Modern & beloved saints', 'Scotland, mothers', 'A queen who fed orphans and the poor at her own table every day and encouraged learning and faith in Scotland.', 'Saint Margaret of Scotland'],
    ['Juan Diego', '12-09', 'Modern & beloved saints', 'Indigenous peoples, Mexico', 'An Indigenous man of Mexico to whom Our Lady of Guadalupe appeared in 1531, leaving her image on his cloak.', 'Juan Diego'],
    ['Kateri Tekakwitha', '07-14', 'Modern & beloved saints', 'Ecology, Indigenous peoples', 'A young Mohawk–Algonquin woman who became Christian, lived a life of prayer, and died at 24. The first Indigenous North American saint.', 'Kateri Tekakwitha'],
    ['Bernadette Soubirous', '04-16', 'Modern & beloved saints', 'The sick, Lourdes', 'A poor, often unwell girl of Lourdes to whom Mary appeared in 1858. Lourdes became a place of pilgrimage and healing; Bernadette became a sister.', 'Bernadette Soubirous'],
    ['John Vianney', '08-04', 'Modern & beloved saints', 'Parish priests', 'The Curé of Ars, a French village priest who spent up to 16 hours a day hearing confessions.', 'John Vianney'],
    ['Josephine Bakhita', '02-08', 'Modern & beloved saints', 'Sudan, survivors of human trafficking', 'Kidnapped as a child in Sudan and sold into slavery, Bakhita was eventually freed in Italy, became a Canossian sister and was known for her gentleness. She forgave those who had hurt her.', 'Josephine Bakhita'],
    ['Maria Goretti', '07-06', 'Modern & beloved saints', 'Young people, forgiveness', 'An Italian girl of eleven who died in 1902 after being attacked. Before she died she forgave her attacker, who later repented and attended her canonisation.', 'Maria Goretti', 1],
    ['Faustina Kowalska', '10-05', 'Modern & beloved saints', 'Divine Mercy', 'A Polish sister whose diary records Jesus’ message of mercy. The Divine Mercy image and chaplet come from her.', 'Faustina Kowalska'],
    ['Maximilian Kolbe', '08-14', 'Martyrs', 'Prisoners, families, journalists', 'A Polish Franciscan priest who offered to take the place of a father condemned to death in Auschwitz in 1941.', 'Maximilian Kolbe', 1],
    ['Teresa Benedicta of the Cross (Edith Stein)', '08-09', 'Martyrs', 'Europe, philosophers', 'A Jewish-born philosopher who became Catholic and a Carmelite nun. She was killed at Auschwitz in 1942.', 'Edith Stein', 1],
    ['Pio of Pietrelcina (Padre Pio)', '09-23', 'Modern & beloved saints', 'Stress relief, confessors', 'An Italian Capuchin friar known for his prayer, long hours in the confessional and the stigmata. He founded a hospital, the Home for the Relief of Suffering.', 'Padre Pio'],
    ['Teresa of Calcutta (Mother Teresa)', '09-05', 'Modern & beloved saints', 'Missionaries of Charity, volunteers', 'An Albanian sister who served the poorest of the poor in Kolkata, founded the Missionaries of Charity and received the Nobel Peace Prize in 1979.', 'Mother Teresa'],
    ['Gianna Beretta Molla', '04-28', 'Modern & beloved saints', 'Mothers, doctors, unborn children', 'An Italian paediatrician, wife and mother who died in 1962 after choosing to continue her pregnancy despite her own illness.', 'Gianna Beretta Molla'],
    ['Óscar Romero', '03-24', 'Martyrs', 'The Americas, persecuted Christians', 'Archbishop of San Salvador who spoke out for the poor and against violence. He was shot while celebrating Mass in 1980 and canonised in 2018.', 'Óscar Romero', 1],
    ['John XXIII', '10-11', 'Modern & beloved saints', 'Papal delegates, Christian unity', 'A warm, humble pope who called the Second Vatican Council, which opened in 1962.', 'Pope John XXIII'],
    ['John Paul II', '10-22', 'Modern & beloved saints', 'World Youth Day, families', 'Pope from 1978 to 2005, he travelled the world, began World Youth Day, helped end communism in Eastern Europe and visited New Zealand in 1986.', 'Pope John Paul II'],
    ['Pier Giorgio Frassati', '07-04', 'Modern & beloved saints', 'Young people, mountaineers', 'A joyful young Italian who loved mountain climbing and quietly served the poor of Turin. He died at 24 in 1925 and was canonised in 2025.', 'Pier Giorgio Frassati'],
    ['Carlo Acutis', '10-12', 'Modern & beloved saints', 'Young people, computer programmers', 'A London-born Italian teenager who loved video games and coding, and built a website about Eucharistic miracles. He died of leukaemia at 15 in 2006 and was canonised in 2025.', 'Carlo Acutis']
  ];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var wikiCache = {};
  function wiki(title) {
    if (!wikiCache[title]) wikiCache[title] = fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title.replace(/ /g, '_'))).then(function (r) { if (!r.ok) throw Error(); return r.json(); }).then(function (d) { return { img: d.thumbnail && d.thumbnail.source, orig: d.originalimage && d.originalimage.source, extract: d.extract, url: d.content_urls && d.content_urls.desktop.page }; }).catch(function () { delete wikiCache[title]; return null; });
    return wikiCache[title];
  }
  function SaintPhoto(props) {
    var s = useState(null), info = s[0], set = s[1];
    useEffect(function () { var live = true; wiki(props.title).then(function (d) { if (live) set(d || {}); }); return function () { live = false; }; }, [props.title]);
    if (props.img) return h('img', { className: props.big ? 'jx-saint-big' : 'jx-saint-img', src: props.img, alt: 'Image of ' + props.name, loading: 'lazy' });
    if (info && info.img) return h('img', { className: props.big ? 'jx-saint-big' : 'jx-saint-img', src: props.big && info.orig ? info.orig : info.img, alt: 'Image of ' + props.name, loading: 'lazy' });
    return h('div', { className: (props.big ? 'jx-saint-big' : 'jx-saint-img') + ' jx-saint-ph', 'aria-hidden': true }, '✝');
  }
  // Original study notes: name → [lived, where, virtue, living it today]
  var SX = {
    'Mary, Mother of God': ['1st century BC – 1st century AD', 'Nazareth, Galilee', 'Trust', 'Say “yes” to God in small things, even when you can’t see the whole plan.'],
    'Joseph': ['1st century BC – 1st century AD', 'Nazareth, Galilee', 'Faithfulness', 'Look after your family quietly and dependably, without needing praise.'],
    'Joachim and Anne': ['1st century BC', 'Judea and Galilee', 'Patience', 'Honour grandparents — call, visit or ask them about their lives.'],
    'John the Baptist': ['c. 5 BC – c. AD 30', 'Judean wilderness and the Jordan River', 'Humility', 'Point others to what is good rather than to yourself.'],
    'Peter': ['c. AD 1 – c. 64', 'Galilee, Jerusalem and Rome', 'Repentance', 'When you fail, say sorry and start again — God never gives up on us.'],
    'Paul': ['c. AD 5 – c. 64', 'Tarsus, Asia Minor, Greece and Rome', 'Zeal', 'Share good news with energy, and keep going when things are hard.'],
    'Andrew': ['1st century', 'Galilee and Greece', 'Invitation', 'Bring a friend along — invite someone new to join you.'],
    'James the Greater': ['1st century – AD 44', 'Galilee and Jerusalem', 'Courage', 'Stand up for what is right, even if you are the first.'],
    'John the Apostle': ['1st century', 'Galilee, Jerusalem and Ephesus', 'Love', 'Love one another — in words and in actions.'],
    'Thomas': ['1st century', 'Galilee, Persia and India', 'Honest faith', 'It’s okay to ask questions; keep searching for the truth.'],
    'Matthew': ['1st century', 'Capernaum, Galilee', 'Openness to change', 'Leave behind habits that hold you back and follow a better path.'],
    'Bartholomew': ['1st century', 'Galilee, Armenia and India (tradition)', 'Sincerity', 'Be the same person on the inside and the outside.'],
    'Philip and James the Less': ['1st century', 'Bethsaida and Jerusalem', 'Curiosity', 'Ask “Show me” — learn by asking and listening.'],
    'Simon and Jude': ['1st century', 'Galilee, Persia (tradition)', 'Hope', 'Don’t give up on people or situations that seem hopeless.'],
    'Matthias': ['1st century', 'Judea', 'Readiness', 'Be ready to step in and help when you are needed.'],
    'Barnabas': ['1st century', 'Cyprus and Antioch', 'Encouragement', 'Be someone’s cheerleader — notice and praise their effort.'],
    'Mark': ['1st century', 'Jerusalem, Rome and Alexandria', 'Perseverance', 'A setback isn’t the end; try again and grow.'],
    'Luke': ['1st century', 'Antioch, Greece and Rome', 'Compassion', 'Notice people on the edges and include them.'],
    'Mary Magdalene': ['1st century', 'Magdala, Galilee', 'Devotion', 'Stay close to those who are suffering; be a faithful friend.'],
    'Martha, Mary and Lazarus': ['1st century', 'Bethany, near Jerusalem', 'Hospitality', 'Welcome guests warmly, and make time to really listen.'],
    'Stephen': ['1st century – c. AD 34', 'Jerusalem', 'Forgiveness', 'Forgive people who hurt you, as hard as that is.'],
    'The Holy Innocents': ['c. 4 BC', 'Bethlehem', 'Innocence', 'Protect children and speak up for the most vulnerable.'],
    'Ignatius of Antioch': ['c. 35 – c. 108', 'Antioch, Syria and Rome', 'Unity', 'Help keep your family, team or parish together.'],
    'Polycarp': ['c. 69 – c. 155', 'Smyrna (Türkiye)', 'Loyalty', 'Stay true to the people and values you love, in old age and young.'],
    'Justin Martyr': ['c. 100 – c. 165', 'Samaria, Ephesus and Rome', 'Seeking truth', 'Think deeply, read widely, and explain your faith kindly.'],
    'Perpetua and Felicity': ['died 203', 'Carthage, North Africa', 'Friendship', 'Stand by your friends whatever their background.'],
    'Cornelius and Cyprian': ['3rd century', 'Rome and Carthage', 'Mercy', 'Welcome back those who have made mistakes.'],
    'Lawrence': ['c. 225 – 258', 'Spain and Rome', 'Generosity', 'Remember that people in need are the true treasure.'],
    'Agnes': ['c. 291 – c. 304', 'Rome', 'Purity of heart', 'Be brave in choosing what is good, even when you are young.'],
    'Agatha': ['c. 231 – c. 251', 'Catania, Sicily', 'Fortitude', 'Keep your dignity and faith when others pressure you.'],
    'Lucy': ['c. 283 – 304', 'Syracuse, Sicily', 'Light', 'Bring light to dark places — be kind where it is needed most.'],
    'Cecilia': ['3rd century', 'Rome', 'Joyful praise', 'Sing, play or listen to music that lifts your heart to God.'],
    'George': ['died c. 303', 'Cappadocia and Palestine', 'Bravery', 'Face your “dragons” — your fears — with God’s help.'],
    'Blaise': ['died c. 316', 'Sebaste, Armenia', 'Care for the sick', 'Help people who are unwell, and pray for healing.'],
    'Catherine of Alexandria': ['c. 287 – c. 305', 'Alexandria, Egypt', 'Wisdom', 'Love learning, and use your knowledge to serve others.'],
    'Boniface': ['c. 675 – 754', 'England and Germany', 'Missionary spirit', 'Share your faith with respect for other cultures.'],
    'Stanislaus': ['c. 1030 – 1079', 'Kraków, Poland', 'Integrity', 'Speak the truth to people in power, respectfully and firmly.'],
    'Thomas Becket': ['c. 1119 – 1170', 'London and Canterbury, England', 'Conscience', 'Do what is right even when it costs you friendships.'],
    'John Fisher and Thomas More': ['1469–1535 and 1478–1535', 'England', 'Good conscience', 'Be a good citizen and a person of integrity at the same time.'],
    'Paul Miki and Companions': ['died 1597', 'Nagasaki, Japan', 'Steadfastness', 'Keep your faith with calm courage.'],
    'Lorenzo Ruiz': ['c. 1600 – 1637', 'Manila, Philippines and Nagasaki, Japan', 'Family love and faith', 'Love your family and your faith together.'],
    'Andrew Kim Taegon and Companions': ['1821–1846 (Andrew Kim)', 'Korea', 'Lay leadership', 'Ordinary people can carry the faith forward — so can you.'],
    'Andrew Dung-Lac and Companions': ['1700s–1800s', 'Vietnam', 'Endurance', 'Keep praying when life is hard; you are not alone.'],
    'Charles Lwanga and Companions': ['c. 1860 – 1886', 'Buganda (Uganda)', 'Protecting others', 'Look out for younger people and keep them safe.'],
    'Peter Chanel': ['1803–1841', 'France and Futuna', 'Gentleness', 'Win people over with patience and kindness.'],
    'Peter To Rot': ['1912–1945', 'Rakunai, Papua New Guinea', 'Faithful marriage', 'Honour family life and serve your community as a lay leader.'],
    'Mary MacKillop': ['1842–1909', 'Australia and Aotearoa New Zealand', 'Service', 'Notice a need nearby and do something practical about it.'],
    'Damien of Molokai': ['1840–1889', 'Belgium and Hawaiʻi', 'Solidarity', 'Stand with people who are left out or forgotten.'],
    'Suzanne Aubert (Venerable)': ['1835–1926', 'France and Aotearoa (Hiruharama, Whanganui River)', 'Practical compassion', 'Learn from and with others — Mother Aubert learned te reo Māori and rongoā.'],
    'Marcellin Champagnat': ['1789–1840', 'France', 'Care for young people', 'Teach and encourage children with love.'],
    'Basil the Great and Gregory Nazianzen': ['c. 329 – c. 390', 'Cappadocia (Türkiye)', 'Friendship in faith', 'Choose friends who help you grow.'],
    'Athanasius': ['c. 296 – 373', 'Alexandria, Egypt', 'Faith under pressure', 'Hold on to the truth even when it isn’t popular.'],
    'Ephrem': ['c. 306 – 373', 'Nisibis and Edessa, Syria', 'Creativity', 'Use songs, poems and art to praise God.'],
    'Cyril of Jerusalem': ['c. 313 – 386', 'Jerusalem', 'Teaching', 'Explain your faith simply to someone who is learning.'],
    'John Chrysostom': ['c. 347 – 407', 'Antioch and Constantinople', 'Honest speech', 'Use your words to build up and to stand up for the poor.'],
    'Ambrose': ['c. 339 – 397', 'Trier and Milan', 'Leadership', 'Lead with fairness and care for those you lead.'],
    'Jerome': ['c. 342 – 420', 'Dalmatia, Rome and Bethlehem', 'Love of Scripture', 'Read a few lines of the Bible each day.'],
    'Augustine': ['354–430', 'Thagaste and Hippo, North Africa', 'Conversion', 'It’s never too late to change and grow closer to God.'],
    'Leo the Great': ['c. 400 – 461', 'Rome', 'Peacemaking', 'Calm arguments and look for peaceful solutions.'],
    'Gregory the Great': ['c. 540 – 604', 'Rome', 'Servant leadership', 'Lead by serving — be a “servant of the servants”.'],
    'Bede the Venerable': ['c. 673 – 735', 'Jarrow, Northumbria (England)', 'Diligence', 'Do your study and work carefully and faithfully.'],
    'Anselm': ['c. 1033 – 1109', 'Aosta, Normandy and Canterbury', 'Faith seeking understanding', 'Ask good questions about what you believe.'],
    'Bernard of Clairvaux': ['1090–1153', 'Burgundy, France', 'Devotion to Mary', 'Ask Mary to help you love Jesus more.'],
    'Hildegard of Bingen': ['1098–1179', 'Rhineland, Germany', 'Wonder', 'Notice God in nature, music and science.'],
    'Thomas Aquinas': ['1225–1274', 'Italy and Paris', 'Study', 'Use your mind as a gift to understand God’s world.'],
    'Bonaventure': ['1221–1274', 'Bagnoregio, Italy and Paris', 'Simplicity', 'Keep life simple and centred on what matters.'],
    'Anthony of Padua': ['1195–1231', 'Lisbon and Padua', 'Helpfulness', 'Help others find what they have lost — including hope.'],
    'Catherine of Siena': ['1347–1380', 'Siena, Italy', 'Boldness', 'Speak up for peace, and pray for leaders.'],
    'Teresa of Ávila': ['1515–1582', 'Ávila, Spain', 'Prayer', 'Talk with God as a friend every day.'],
    'John of the Cross': ['1542–1591', 'Castile, Spain', 'Trust in darkness', 'When life feels dark, keep trusting that light will come.'],
    'Francis de Sales': ['1567–1622', 'Savoy and Geneva', 'Gentleness', 'Be gentle with others — and with yourself.'],
    'Alphonsus Liguori': ['1696–1787', 'Naples, Italy', 'Kindness to sinners', 'Be patient and kind with people who are struggling.'],
    'Irenaeus': ['c. 130 – c. 202', 'Smyrna and Lyon', 'Peacemaking', 'Help people see what unites rather than divides them.'],
    'Thérèse of Lisieux': ['1873–1897', 'Normandy, France', 'The little way', 'Do small things with great love.'],
    'John Henry Newman': ['1801–1890', 'Oxford and Birmingham, England', 'Seeking truth', 'Follow your conscience and keep learning.'],
    'Anthony the Abbot': ['c. 251 – 356', 'Egypt', 'Simplicity', 'Make quiet time; switch off and pray.'],
    'Benedict': ['c. 480 – c. 547', 'Nursia and Monte Cassino, Italy', 'Balance', 'Balance prayer, work and rest each day.'],
    'Scholastica': ['c. 480 – c. 543', 'Nursia and Monte Cassino, Italy', 'Love of family', 'Make time for your brothers and sisters.'],
    'Patrick': ['c. 385 – c. 461', 'Britain and Ireland', 'Courageous mission', 'Go where you are needed, even back to hard places.'],
    'Dominic': ['1170–1221', 'Castile, Spain and southern France', 'Truth with charity', 'Share the truth kindly, and live simply.'],
    'Francis of Assisi': ['c. 1181 – 1226', 'Assisi, Italy', 'Love of creation', 'Care for animals, plants and our common home.'],
    'Clare of Assisi': ['1194–1253', 'Assisi, Italy', 'Poverty of spirit', 'Need less, share more and find joy in simple things.'],
    'Ignatius of Loyola': ['1491–1556', 'Spain and Rome', 'Discernment', 'Each evening, look back on your day and notice where God was.'],
    'Francis Xavier': ['1506–1552', 'Spain, India, Japan and China', 'Missionary zeal', 'Be curious about other cultures and share God’s love.'],
    'Philip Neri': ['1515–1595', 'Florence and Rome', 'Joy', 'Keep a sense of humour — holiness can be cheerful!'],
    'Vincent de Paul': ['1581–1660', 'France', 'Charity', 'Give time or goods to people in need — maybe through a local St Vincent de Paul shop.'],
    'John Baptist de La Salle': ['1651–1719', 'Reims, France', 'Teaching', 'Thank a teacher, and help someone learn.'],
    'John Bosco': ['1815–1888', 'Turin, Italy', 'Cheerful care for youth', 'Make time to play and laugh with young people.'],
    'Elizabeth Ann Seton': ['1774–1821', 'New York and Maryland, USA', 'Resilience', 'Keep going through loss, leaning on God and friends.'],
    'Frances Xavier Cabrini': ['1850–1917', 'Italy and the United States', 'Care for migrants', 'Welcome people new to your country or town.'],
    'Bridget of Sweden': ['1303–1373', 'Sweden and Rome', 'Prayerful family life', 'Pray together as a family, even briefly.'],
    'Rita of Cascia': ['1381–1457', 'Cascia, Italy', 'Reconciliation', 'Be a peacemaker in family arguments.'],
    'Joan of Arc': ['c. 1412 – 1431', 'Domrémy and Orléans, France', 'Courage', 'Trust God and act bravely, whatever your age.'],
    'Aloysius Gonzaga': ['1568–1591', 'Castiglione and Rome, Italy', 'Self-giving', 'Use your gifts to help others, especially the sick.'],
    'Rose of Lima': ['1586–1617', 'Lima, Peru', 'Service', 'Serve quietly at home and in your community.'],
    'Martin de Porres': ['1579–1639', 'Lima, Peru', 'Humble kindness', 'Treat everyone — people and animals — with gentleness.'],
    'Martin of Tours': ['c. 316 – 397', 'Pannonia (Hungary) and Tours, France', 'Sharing', 'Share what you have, like Martin sharing his cloak.'],
    'Nicholas': ['c. 270 – c. 343', 'Myra (Türkiye)', 'Secret generosity', 'Do a kind act secretly, without being thanked.'],
    'Elizabeth of Hungary': ['1207–1231', 'Hungary and Thuringia, Germany', 'Care for the poor', 'Donate food or clothes to a local food bank.'],
    'Margaret of Scotland': ['c. 1045 – 1093', 'Hungary, England and Scotland', 'Family faith', 'Make your home a place of prayer and welcome.'],
    'Juan Diego': ['1474–1548', 'Mexico', 'Humble trust', 'God chooses ordinary people — you matter.'],
    'Kateri Tekakwitha': ['1656–1680', 'Mohawk homeland (New York) and Kahnawake (Canada)', 'Faith and culture', 'Honour your heritage and your faith together.'],
    'Bernadette Soubirous': ['1844–1879', 'Lourdes, France', 'Simplicity', 'Stay humble and honest, even when people doubt you.'],
    'John Vianney': ['1786–1859', 'Ars, France', 'Pastoral care', 'Be a patient listener for someone who needs to talk.'],
    'Josephine Bakhita': ['c. 1869 – 1947', 'Darfur (Sudan) and Italy', 'Freedom and forgiveness', 'Treat every person with dignity — and forgive.'],
    'Maria Goretti': ['1890–1902', 'Corinaldo and Nettuno, Italy', 'Forgiveness', 'Pray for people who have hurt you.'],
    'Faustina Kowalska': ['1905–1938', 'Poland', 'Trust in mercy', 'Say “Jesus, I trust in you” when you feel worried.'],
    'Maximilian Kolbe': ['1894–1941', 'Poland and Auschwitz', 'Self-sacrifice', 'Put someone else first today.'],
    'Teresa Benedicta of the Cross (Edith Stein)': ['1891–1942', 'Breslau (Wrocław), Germany and Auschwitz', 'Truth-seeking', 'Keep searching for the truth with an open heart.'],
    'Pio of Pietrelcina (Padre Pio)': ['1887–1968', 'San Giovanni Rotondo, Italy', 'Prayerful patience', '“Pray, hope and don’t worry.”'],
    'Teresa of Calcutta (Mother Teresa)': ['1910–1997', 'Skopje and Kolkata, India', 'Love in action', 'Do something beautiful for God — start with someone near you.'],
    'Gianna Beretta Molla': ['1922–1962', 'Milan region, Italy', 'Love of family', 'Value every life, and balance work and family with love.'],
    'Óscar Romero': ['1917–1980', 'El Salvador', 'Justice', 'Be a voice for people who are not heard.'],
    'John XXIII': ['1881–1963', 'Bergamo, Italy and Rome', 'Openness', 'Greet everyone warmly and look for common ground.'],
    'John Paul II': ['1920–2005', 'Kraków, Poland and Rome', 'Hope', '“Be not afraid” — face the future with hope.'],
    'Pier Giorgio Frassati': ['1901–1925', 'Turin, Italy', 'Joyful service', 'Enjoy the outdoors and friends — and quietly help the poor.'],
    'Carlo Acutis': ['1991–2006', 'London and Milan', 'Using technology for good', 'Use your phone and the internet to spread goodness.']
  };
  var CATQ = {
    'Mary & the Holy Family': ['How does your family show love to each other?', 'Make a family prayer corner with a picture and a candle.'],
    'Apostles & Bible saints': ['What would it have been like to meet Jesus?', 'Find this saint in the Bible together and read their story.'],
    'Martyrs': ['What gives people courage to stand up for what is right?', 'Draw a symbol of courage (a shield, a lion, a candle) and write a prayer for persecuted Christians.'],
    'Oceania & Aotearoa': ['How can we serve people in our own community?', 'Find where this saint lived on a map of the Pacific.'],
    'Doctors of the Church': ['What is one question about God you would like to explore?', 'Write a short prayer asking for wisdom before school or work.'],
    'Religious founders': ['What need in our community could we help with?', 'Plan one small act of service as a family this week.'],
    'Modern & beloved saints': ['Which of this saint’s qualities would you like to grow in?', 'Make a bookmark with the saint’s name and virtue.']
  };
  function prayerFor(x, sx) {
    var name = x[0].replace(/ \(.*\)/, ''), many = / and |Companions|Innocents/.test(name), who = (many ? 'Saints ' : (/^(Mary, Mother|Joseph|Mary Magdalene)/.test(name) ? 'Saint ' : 'Saint ')) + name.replace(/^The /, '');
    if (/^Mary, Mother of God/.test(name)) who = 'Holy Mary, Mother of God';
    if (/Venerable/.test(x[0])) who = name;
    var v = (sx && sx[2] || 'faith').toLowerCase();
    if (/Venerable/.test(x[0])) who = 'Venerable ' + name;
    return who + ', your life showed us ' + v + '. Pray for us, that we may grow in ' + v + ' too. ' + (x[3] ? 'Watch over all in your care: ' + x[3].replace(/^The /, 'the ') + '. ' : '') + 'Help us follow Jesus with joyful hearts. Amen.';
  }

  function SaintDetail(props) {
    var x = props.s, sx = SX[x[0]], q = CATQ[x[2]];
    useEffect(function () { function k(e) { if (e.key === 'Escape') props.onClose(); } window.addEventListener('keydown', k); return function () { window.removeEventListener('keydown', k); }; }, [x]);
    var mm = parseInt(x[1].slice(0, 2), 10), dd = parseInt(x[1].slice(3), 10);
    return h('div', { className: 'jx-el-overlay', role: 'dialog', 'aria-modal': true, 'aria-label': x[0], onClick: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h('article', { className: 'jx-el-detail jx-saint-detail' },
        h('button', { type: 'button', className: 'jx-el-close', onClick: props.onClose, 'aria-label': 'Close' }, '×'),
        h('div', { className: 'jx-saint-top' }, h(SaintPhoto, { title: x[5], name: x[0], big: true, img: x[7] }),
          h('div', null, h('p', { className: 'eyebrow' }, x[2].toUpperCase() + (x[6] ? ' · MARTYR' : '')), h('h2', null, x[0]), h('p', null, h('strong', null, 'Feast: '), dd + ' ' + MONTHS[mm - 1]), h('p', null, h('strong', null, 'Patron of: '), x[3]))),
        h('div', { className: 'jx-el-body' },
          sx && h('div', { className: 'jx-saint-facts' },
            h('div', null, h('span', null, 'Lived'), h('strong', null, sx[0])),
            h('div', null, h('span', null, 'Where'), h('strong', null, sx[1])),
            h('div', null, h('span', null, 'Known for'), h('strong', null, sx[2]))),
          h('h3', null, 'Their story'), h('p', null, x[4]),
          sx && h(R.Fragment, null, h('h3', null, 'Living it today'), h('p', null, sx[3])),
          h('h3', null, 'A prayer'), h('p', { className: 'jx-saint-prayer' }, prayerFor(x, sx)),
          q && h(R.Fragment, null, h('h3', null, 'For families'), h('ul', null, h('li', null, h('strong', null, 'Talk about it: '), q[0]), h('li', null, h('strong', null, 'Try this: '), q[1]), h('li', null, h('strong', null, 'Feast day idea: '), 'On ' + dd + ' ' + MONTHS[mm - 1] + ', light a candle at dinner, read the story aloud and say the prayer together.'))),
          h('div', { className: 'jx-row' }, h(JNZX.ShareMini, { title: x[0], text: x[0] + ' (feast ' + dd + ' ' + MONTHS[mm - 1] + ') — ' + x[4] + (sx ? '\nLiving it today: ' + sx[3] : '') })),
          h('p', { className: 'small-note' }, 'Story, notes and prayer: original material by The James NZ. Portrait: public-domain or freely licensed artwork via Wikimedia Commons. Feast dates follow the General Roman Calendar; some local calendars differ.'))));
  }
  function SaintsPage(props) {
    var c = useState('All'), cat = c[0], setCat = c[1];
    var m = useState('All'), mon = m[0], setMon = m[1];
    var q = useState(''), qq = q[0], setQ = q[1];
    var o = useState(null), open = o[0], setOpen = o[1];
    var pg = useState(0), page = pg[0], setPage = pg[1];
    var today = new Date(), todayKey = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    var cats = ['All', 'Martyrs only'].concat(Array.from(new Set(S.map(function (x) { return x[2]; }))));
    var rows = S.filter(function (x) { return (cat === 'All' || (cat === 'Martyrs only' ? x[6] : x[2] === cat)) && (mon === 'All' || MONTHS[parseInt(x[1], 10) - 1] === mon) && (x[0] + ' ' + x[3] + ' ' + x[4]).toLowerCase().indexOf(qq.toLowerCase()) >= 0; })
      .sort(function (a, b) { return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0; });
    var per = 24, pages = Math.max(1, Math.ceil(rows.length / per)), p = Math.min(page, pages - 1);
    var near = S.filter(function (x) { return x[1] >= todayKey; }).sort(function (a, b) { return a[1] < b[1] ? -1 : 1; }).slice(0, 3);
    if (near.length < 3) near = near.concat(S.slice().sort(function (a, b) { return a[1] < b[1] ? -1 : 1; }).slice(0, 3 - near.length));
    return h('div', null,
      JNZX.Header('FAITH & HOPE · SAINTS & MARTYRS', 'A great cloud of witnesses.', S.length + ' saints and martyrs from the apostles to our own time, including Oceania and Aotearoa — each with their feast day, what they are patrons of, and their story.'),
      h('div', { className: 'jx-card' }, h('h3', null, 'Coming up'), h('div', { className: 'jx-saint-row' }, near.map(function (x) { var mm = parseInt(x[1], 10), dd = parseInt(x[1].slice(3), 10); return h('button', { key: x[0], type: 'button', className: 'jx-saint-mini', onClick: function () { setOpen(x); } }, h(SaintPhoto, { title: x[5], name: x[0], img: x[7] }), h('span', null, h('strong', null, x[0]), h('small', null, dd + ' ' + MONTHS[mm - 1]))); }))),
      h('div', { className: 'jx-row' }, h(JNZX.Search, { value: qq, onChange: function (v) { setQ(v); setPage(0); }, placeholder: 'Search by name, patronage or story' }),
        h('label', null, 'Month', h('select', { value: mon, onChange: function (e) { setMon(e.target.value); setPage(0); } }, ['All'].concat(MONTHS).map(function (x) { return h('option', { key: x, value: x }, x); })))),
      h(JNZX.Chips, { label: 'Category', options: cats, value: cat, onChange: function (v) { setCat(v); setPage(0); } }),
      h('p', { className: 'jx-muted' }, rows.length + ' shown'),
      h('div', { className: 'jx-saint-grid' }, rows.slice(p * per, p * per + per).map(function (x) {
        var mm = parseInt(x[1], 10), dd = parseInt(x[1].slice(3), 10);
        return h('button', { key: x[0], type: 'button', className: 'jx-saint-card', onClick: function () { setOpen(x); } },
          h(SaintPhoto, { title: x[5], name: x[0], img: x[7] }),
          h('span', { className: 'jx-saint-txt' }, h('small', null, dd + ' ' + MONTHS[mm - 1] + (x[6] ? ' · Martyr' : '')), h('strong', null, x[0]), h('span', null, x[3])));
      })),
      h(JNZX.Pager, { page: p, pages: pages, onPage: setPage }),
      h('p', { className: 'small-note' }, 'Thousands of saints and blesseds are honoured by the Church. This directory begins with the saints of the General Roman Calendar, the great martyrs and the holy people of our region. For every saint of the day, see Saint of the Day or Vatican News.'),
      open && h(SaintDetail, { s: open, onClose: function () { setOpen(null); } }),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:saints', SaintsPage);
  JNZX._saints = S;

  /* ======================= FAITH FORMATION LIBRARY ======================= */
  var BOOKS_OT = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Tobit', 'Judith', 'Esther', '1 Maccabees', '2 Maccabees', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Songs', 'Wisdom', 'Sirach', 'Isaiah', 'Jeremiah', 'Lamentations', 'Baruch', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'];
  var BOOKS_NT = ['Matthew', 'Mark', 'Luke', 'John', 'Acts of the Apostles', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'];
  var LIB = [
    { id: 'year', title: 'The liturgical year & colours', words: ['ADVENT', 'CHRISTMAS', 'LENT', 'EASTER', 'PENTECOST', 'ORDINARY', 'PURPLE', 'WHITE', 'GREEN', 'RED', 'ROSE', 'TRIDUUM'], body: function () { return h('div', null,
      h('p', null, 'The Church’s year follows the life of Christ. It begins on the First Sunday of Advent and has two great seasons of preparation and celebration.'),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('thead', null, h('tr', null, h('th', null, 'Season'), h('th', null, 'Colour'), h('th', null, 'Meaning'))), h('tbody', null, [
        ['Advent (4 Sundays before Christmas)', 'Purple (rose on the 3rd Sunday, Gaudete)', 'Joyful waiting for Christ’s coming at Christmas and at the end of time.'],
        ['Christmas (to the Baptism of the Lord)', 'White or gold', 'God becomes one of us in Jesus.'],
        ['Ordinary Time (two parts)', 'Green', 'Growing in faith through Jesus’ teaching and ministry. “Ordinary” comes from ordinal — counted weeks.'],
        ['Lent (Ash Wednesday to Holy Thursday)', 'Purple (rose on the 4th Sunday, Laetare)', 'Forty days of prayer, fasting and almsgiving.'],
        ['Easter Triduum', 'White on Holy Thursday; red on Good Friday; white at the Easter Vigil', 'The three most holy days: the Lord’s Supper, his Passion and his Resurrection.'],
        ['Easter (50 days to Pentecost)', 'White or gold; red at Pentecost', 'Christ is risen; the Holy Spirit is given to the Church.'],
        ['Feasts of martyrs and the Holy Spirit', 'Red', 'Blood of the martyrs and fire of the Spirit.']
      ].map(function (r) { return h('tr', { key: r[0] }, r.map(function (c, i) { return h('td', { key: i }, c); })); })))),
      h('p', { className: 'small-note' }, 'See Family Together › Christmas, Easter & Matariki for this year’s dates.')); } },
    { id: 'mass', title: 'The parts of the Mass', words: ['GLORIA', 'READINGS', 'PSALM', 'GOSPEL', 'HOMILY', 'CREED', 'OFFERTORY', 'SANCTUS', 'CONSECRATION', 'COMMUNION', 'BLESSING', 'AMEN'], body: function () { return h('div', null,
      h('h4', null, 'Introductory Rites'), ul(['Entrance and Sign of the Cross — we gather as God’s people.', 'Greeting and Penitential Act — we ask God’s mercy (Lord, have mercy).', 'Gloria — a hymn of praise (not in Advent or Lent).', 'Collect — the opening prayer of the day.']),
      h('h4', null, 'Liturgy of the Word'), ul(['First Reading (usually Old Testament) and Responsorial Psalm.', 'Second Reading (on Sundays) from the letters of the apostles.', 'Gospel Acclamation (Alleluia, except in Lent) and the Gospel — we stand for the words of Jesus.', 'Homily — the priest or deacon explains the readings.', 'Profession of Faith (the Creed) and the Universal Prayer (Prayers of the Faithful).']),
      h('h4', null, 'Liturgy of the Eucharist'), ul(['Preparation of the gifts — bread and wine are brought to the altar.', 'Eucharistic Prayer — including the Holy, Holy (Sanctus) and the words of consecration, when the bread and wine become the Body and Blood of Christ.', 'The Great Amen.', 'Communion Rite — the Lord’s Prayer, the Sign of Peace, the Lamb of God and Holy Communion.']),
      h('h4', null, 'Concluding Rites'), ul(['Blessing and dismissal — “Go in peace, glorifying the Lord by your life.”'])); } },
    { id: 'sacraments', title: 'The seven sacraments', words: ['BAPTISM', 'CONFIRMATION', 'EUCHARIST', 'PENANCE', 'ANOINTING', 'ORDERS', 'MATRIMONY', 'GRACE', 'CHRISM', 'WATER', 'BREAD', 'WINE'], body: function () { return h('div', null,
      h('p', null, 'A sacrament is an outward sign, given by Christ, through which God gives us his grace.'),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('thead', null, h('tr', null, h('th', null, 'Sacrament'), h('th', null, 'Group'), h('th', null, 'Signs'), h('th', null, 'What it gives'))), h('tbody', null, [
        ['Baptism', 'Initiation', 'Water; “I baptise you in the name of the Father…”', 'New life as a child of God; frees from sin; welcomes into the Church'],
        ['Confirmation', 'Initiation', 'Laying on of hands; anointing with chrism', 'Strengthens us with the gifts of the Holy Spirit'],
        ['Eucharist', 'Initiation', 'Bread and wine', 'The Body and Blood of Christ, food for the journey'],
        ['Reconciliation (Penance)', 'Healing', 'Confession of sins and absolution', 'God’s forgiveness and peace'],
        ['Anointing of the Sick', 'Healing', 'Anointing with the oil of the sick', 'Strength, peace and healing for the seriously ill or elderly'],
        ['Holy Orders', 'Service of communion', 'Laying on of hands by a bishop', 'Ordains deacons, priests and bishops to serve the Church'],
        ['Matrimony', 'Service of communion', 'The couple’s exchange of consent', 'A lifelong covenant of love, open to children']
      ].map(function (r) { return h('tr', { key: r[0] }, r.map(function (c, i) { return h('td', { key: i }, i === 0 ? h('strong', null, c) : c); })); })))),
      h('p', null, 'To prepare for a sacrament (for example First Communion, Confirmation, Baptism of a child or adult, or marriage), contact your parish office — you can find parishes under Faith & Hope › Find a Catholic Church.')); } },
    { id: 'commandments', title: 'The Ten Commandments & the Great Commandment', words: ['GOD', 'NAME', 'SABBATH', 'HONOUR', 'KILL', 'ADULTERY', 'STEAL', 'WITNESS', 'COVET', 'LOVE', 'NEIGHBOUR', 'LAW'], body: function () { return h('div', null,
      h('p', null, 'The Ten Commandments (Exodus 20; Deuteronomy 5), as numbered in the Catholic tradition:'),
      ol(['I am the Lord your God: you shall not have strange gods before me.', 'You shall not take the name of the Lord your God in vain.', 'Remember to keep holy the Lord’s Day.', 'Honour your father and your mother.', 'You shall not kill.', 'You shall not commit adultery.', 'You shall not steal.', 'You shall not bear false witness against your neighbour.', 'You shall not covet your neighbour’s wife.', 'You shall not covet your neighbour’s goods.']),
      h('div', { className: 'jx-note' }, h('strong', null, 'The Great Commandment (Matthew 22:37–39): '), 'Love the Lord your God with all your heart, with all your soul and with all your mind; and love your neighbour as yourself.')); } },
    { id: 'beatitudes', title: 'The Beatitudes', words: ['BLESSED', 'POOR', 'MOURN', 'MEEK', 'HUNGER', 'MERCIFUL', 'PURE', 'PEACEMAKERS', 'KINGDOM', 'COMFORTED', 'HEAVEN', 'JOY'], body: function () { return h('div', null,
      h('p', null, 'From the Sermon on the Mount (Matthew 5:3–10), Jesus’ picture of true happiness:'),
      ul(['Blessed are the poor in spirit, for theirs is the kingdom of heaven.', 'Blessed are those who mourn, for they will be comforted.', 'Blessed are the meek, for they will inherit the earth.', 'Blessed are those who hunger and thirst for righteousness, for they will be filled.', 'Blessed are the merciful, for they will receive mercy.', 'Blessed are the pure in heart, for they will see God.', 'Blessed are the peacemakers, for they will be called children of God.', 'Blessed are those who are persecuted for righteousness’ sake, for theirs is the kingdom of heaven.'])); } },
    { id: 'mercy', title: 'Works of Mercy', words: ['FEED', 'HUNGRY', 'THIRSTY', 'CLOTHE', 'SHELTER', 'VISIT', 'SICK', 'PRISONERS', 'BURY', 'COUNSEL', 'FORGIVE', 'PRAY'], body: function () { return h('div', null,
      h('div', { className: 'jx-cards2' },
        h('div', null, h('h4', null, 'Corporal works (for the body)'), ul(['Feed the hungry', 'Give drink to the thirsty', 'Clothe the naked', 'Shelter the homeless', 'Visit the sick', 'Visit the imprisoned', 'Bury the dead'])),
        h('div', null, h('h4', null, 'Spiritual works (for the soul)'), ul(['Counsel the doubtful', 'Instruct the ignorant', 'Admonish sinners', 'Comfort the sorrowful', 'Forgive injuries', 'Bear wrongs patiently', 'Pray for the living and the dead']))),
      h('div', { className: 'jx-note' }, h('strong', null, 'Family idea: '), 'Choose one work of mercy each week — bake for a food bank, visit a grandparent in care, sort clothes for an op shop, write a sympathy card.')); } },
    { id: 'spirit', title: 'Gifts and fruits of the Holy Spirit', words: ['WISDOM', 'UNDERSTANDING', 'COUNSEL', 'FORTITUDE', 'KNOWLEDGE', 'PIETY', 'FEAR', 'LOVE', 'JOY', 'PEACE', 'PATIENCE', 'KINDNESS'], body: function () { return h('div', null,
      h('div', { className: 'jx-cards2' },
        h('div', null, h('h4', null, 'The seven gifts (Isaiah 11:2–3)'), ul(['Wisdom', 'Understanding', 'Counsel (right judgement)', 'Fortitude (courage)', 'Knowledge', 'Piety (reverence)', 'Fear of the Lord (wonder and awe)'])),
        h('div', null, h('h4', null, 'The twelve fruits (Galatians 5:22–23, Catholic tradition)'), ul(['Charity (love)', 'Joy', 'Peace', 'Patience', 'Kindness', 'Goodness', 'Generosity', 'Gentleness', 'Faithfulness', 'Modesty', 'Self-control', 'Chastity'])))); } },
    { id: 'virtues', title: 'Virtues, capital sins and the precepts of the Church', words: ['FAITH', 'HOPE', 'CHARITY', 'PRUDENCE', 'JUSTICE', 'FORTITUDE', 'TEMPERANCE', 'HUMILITY', 'GENEROSITY', 'CHASTITY', 'DILIGENCE', 'MEEKNESS'], body: function () { return h('div', null,
      h('h4', null, 'Theological virtues'), ul(['Faith — trusting God and what he has revealed.', 'Hope — desiring heaven and trusting in God’s promises.', 'Charity — loving God above all and our neighbour as ourselves.']),
      h('h4', null, 'Cardinal virtues'), ul(['Prudence — choosing the good wisely.', 'Justice — giving each person what is due.', 'Fortitude — courage in difficulty.', 'Temperance — moderation and self-control.']),
      h('h4', null, 'The seven capital sins and their opposite virtues'), ul(['Pride — humility', 'Greed — generosity', 'Lust — chastity', 'Anger — meekness (patience)', 'Gluttony — temperance', 'Envy — kindness', 'Sloth — diligence']),
      h('h4', null, 'The precepts of the Church'), ol(['Attend Mass on Sundays and holy days of obligation, and rest from unnecessary work.', 'Confess your sins at least once a year.', 'Receive Holy Communion at least during the Easter season.', 'Observe the days of fasting and abstinence.', 'Help to provide for the needs of the Church.'])); } },
    { id: 'stations', title: 'The Stations of the Cross', words: ['CONDEMNED', 'CROSS', 'FALLS', 'MOTHER', 'SIMON', 'VERONICA', 'WOMEN', 'STRIPPED', 'NAILED', 'DIES', 'TAKEN', 'TOMB'], body: function () { return h('div', null,
      h('p', null, 'A prayerful walk with Jesus on the way to Calvary, often prayed on Fridays in Lent.'),
      ol(['Jesus is condemned to death', 'Jesus carries his cross', 'Jesus falls the first time', 'Jesus meets his mother', 'Simon of Cyrene helps Jesus carry the cross', 'Veronica wipes the face of Jesus', 'Jesus falls the second time', 'Jesus meets the women of Jerusalem', 'Jesus falls the third time', 'Jesus is stripped of his garments', 'Jesus is nailed to the cross', 'Jesus dies on the cross', 'Jesus is taken down from the cross', 'Jesus is laid in the tomb']),
      h('p', { className: 'small-note' }, 'Many parishes add a fifteenth station, the Resurrection.')); } },
    { id: 'symbols', title: 'Catholic symbols & sacred objects', words: ['CRUCIFIX', 'ROSARY', 'CHALICE', 'ALTAR', 'CANDLE', 'TABERNACLE', 'FONT', 'ICHTHYS', 'DOVE', 'LAMB', 'ALPHA', 'OMEGA'], body: function () { return h('div', null,
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null, [
        ['Crucifix', 'A cross with the figure of Jesus, reminding us of his saving love.'], ['Chi-Rho (☧)', 'The first two Greek letters of “Christ”.'], ['IHS', 'The first letters of the name Jesus in Greek.'],
        ['Alpha and Omega (Α Ω)', 'The first and last letters of the Greek alphabet: Christ is the beginning and the end (Revelation 22:13).'], ['Ichthys (fish)', 'An early Christian sign; the Greek word for fish spells the initials of “Jesus Christ, Son of God, Saviour”.'],
        ['Dove', 'The Holy Spirit, and peace.'], ['Lamb', 'Jesus, the Lamb of God who takes away the sins of the world.'], ['Paschal (Easter) candle', 'Christ, the light of the world; lit at the Easter Vigil, baptisms and funerals.'],
        ['Tabernacle and sanctuary lamp', 'The tabernacle holds the consecrated Hosts; a lamp burns beside it to show Christ is present.'], ['Holy water and font', 'A reminder of our baptism as we bless ourselves entering church.'],
        ['Chalice and paten', 'The cup and plate used for the wine and bread at Mass.'], ['Rosary', 'Prayer beads for meditating on the life of Jesus with Mary.']
      ].map(function (r) { return h('tr', { key: r[0] }, h('th', null, r[0]), h('td', null, r[1])); }))))); } },
    { id: 'bible', title: 'Books of the Bible (Catholic canon)', words: ['GENESIS', 'EXODUS', 'PSALMS', 'ISAIAH', 'MATTHEW', 'MARK', 'LUKE', 'JOHN', 'ACTS', 'ROMANS', 'HEBREWS', 'REVELATION'], body: function () { return h('div', null,
      h('p', null, 'The Catholic Bible has 73 books: 46 in the Old Testament and 27 in the New Testament. Tobit, Judith, 1 and 2 Maccabees, Wisdom, Sirach and Baruch (and parts of Esther and Daniel) are called the deuterocanonical books.'),
      h('div', { className: 'jx-cards2' }, h('div', null, h('h4', null, 'Old Testament (46)'), h('p', { className: 'jx-books' }, BOOKS_OT.join(' · '))), h('div', null, h('h4', null, 'New Testament (27)'), h('p', { className: 'jx-books' }, BOOKS_NT.join(' · ')))),
      h('p', { className: 'small-note' }, 'Look up people, places and words in the Bible Dictionary.')); } },
    { id: 'jesus', title: 'Names and titles of Jesus', words: ['EMMANUEL', 'MESSIAH', 'SAVIOUR', 'SHEPHERD', 'LIGHT', 'BREAD', 'LORD', 'TEACHER', 'KING', 'LAMB', 'WORD', 'SON'], body: function () { return h('div', null,
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null, [
        ['Jesus', 'From the Hebrew Yeshua, “God saves” (Matthew 1:21).'], ['Christ / Messiah', '“The Anointed One”.'], ['Emmanuel', '“God is with us” (Matthew 1:23).'], ['Lamb of God', 'John 1:29.'],
        ['The Good Shepherd', 'John 10:11.'], ['The Light of the World', 'John 8:12.'], ['The Bread of Life', 'John 6:35.'], ['The Way, the Truth and the Life', 'John 14:6.'],
        ['The Word', 'John 1:1, 14.'], ['Son of God / Son of Man', 'Titles of his divinity and his humanity.'], ['Lord', 'Greek Kyrios, used of God.'], ['Rabbi', '“Teacher”.']
      ].map(function (r) { return h('tr', { key: r[0] }, h('th', null, r[0]), h('td', null, r[1])); }))))); } },
    { id: 'prayers', title: 'Prayers every Catholic family knows', words: ['SIGN', 'CROSS', 'FATHER', 'HAIL', 'MARY', 'GLORY', 'CREED', 'CONTRITION', 'GRACE', 'ANGEL', 'AMEN', 'PRAY'], body: function () { return h('div', null,
      h('h4', null, 'Sign of the Cross'), h('p', null, 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.'),
      h('h4', null, 'Glory Be'), h('p', null, 'Glory be to the Father, and to the Son, and to the Holy Spirit; as it was in the beginning, is now, and ever shall be, world without end. Amen.'),
      h('h4', null, 'Grace before meals'), h('p', null, 'Bless us, O Lord, and these thy gifts, which we are about to receive from thy bounty, through Christ our Lord. Amen.'),
      h('h4', null, 'Prayer to my Guardian Angel'), h('p', null, 'Angel of God, my guardian dear, to whom God’s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.'),
      h('h4', null, 'Act of Contrition (traditional)'), h('p', null, 'O my God, I am heartily sorry for having offended you, and I detest all my sins because of your just punishments, but most of all because they offend you, my God, who are all good and deserving of all my love. I firmly resolve, with the help of your grace, to sin no more and to avoid the near occasion of sin. Amen.'),
      h('p', { className: 'small-note' }, 'The Our Father, Hail Mary and Rosary prayers are in Faith & Hope › Pray Together and The Rosary, Step by Step.')); } }
  ];
  var LESSONS = [
    ['Creation and caring for our common home', '5–10', 'Genesis 1:1–31', 'Children can say that God made the world good and name one way to care for it.', ['Read the Creation story with actions for each day.', 'Go outside and find something from each “day” (light, sky, water, plants, animals).', 'Make a family promise to care for creation (a rubbish pick-up, a garden, saving water).'], 'Thank God for one thing in creation each.'],
    ['The Good Samaritan', '6–12', 'Luke 10:25–37', 'Children can explain who our neighbour is and plan an act of kindness.', ['Read the parable and act it out with toys or dress-ups.', 'Ask: who walked past? who stopped? why?', 'Plan one kindness for someone outside your family this week.'], 'Pray for people who are hurting.'],
    ['The Lost Sheep and God’s mercy', '4–9', 'Luke 15:1–7', 'Children can say that God looks for us and is happy when we come back.', ['Hide a toy sheep for children to find.', 'Read the story and talk about how the shepherd felt.', 'Connect to the sacrament of Reconciliation for older children.'], 'Pray the Act of Contrition together.'],
    ['Preparing for First Communion', '7–9', 'Luke 22:14–20; John 6:35', 'Children can describe the Eucharist as Jesus’ gift of himself.', ['Bake simple bread together and talk about the Last Supper.', 'Walk through the parts of the Mass with a children’s missal.', 'Practise receiving Communion reverently (hands or tongue) with an unconsecrated wafer only if your parish provides one.'], 'Pray: “Jesus, I welcome you into my heart.”'],
    ['Mary, our mother', '4–12', 'Luke 1:26–38', 'Children can tell the story of the Annunciation and pray the Hail Mary.', ['Read the Annunciation and talk about Mary’s “yes”.', 'Make a simple rosary from beads or knotted string.', 'Pray one decade together.'], 'Ask Mary to help us say yes to God.'],
    ['The saints are our friends', '6–12', 'Hebrews 12:1', 'Children can describe one saint and how they followed Jesus.', ['Choose a saint from Saints & Martyrs whose feast is near.', 'Read their story and draw a picture of something they did.', 'Ask: what could I do this week like this saint?'], 'Ask the saint to pray for your family.'],
    ['Lent: prayer, fasting and almsgiving', '6–14', 'Matthew 6:1–18', 'Children can name the three Lenten practices and choose one.', ['Read Jesus’ teaching on prayer, fasting and giving.', 'Make an almsgiving box.', 'Write a Lenten promise and put it on the fridge.'], 'Pray the Our Father slowly together.'],
    ['Pentecost: the gift of the Holy Spirit', '6–14', 'Acts 2:1–13', 'Children can name gifts of the Holy Spirit and how they help us.', ['Read Pentecost with sound effects (wind, fire).', 'Make a paper dove with the seven gifts on its wings.', 'Talk about when we need courage or wisdom.'], 'Pray: “Come, Holy Spirit, fill our hearts.”']
  ];

  /* word search worksheet generator */
  function makeGrid(words, size, seed) {
    var rnd = window.JNZXMath ? JNZXMath.rng(seed) : Math.random, grid = Array.from({ length: size }, function () { return Array(size).fill(''); }), placed = [];
    var dirs = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    words.slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (w) {
      for (var t = 0; t < 300; t++) {
        var d = dirs[Math.floor(rnd() * dirs.length)], r = Math.floor(rnd() * size), c = Math.floor(rnd() * size), ok = true;
        for (var i = 0; i < w.length; i++) { var rr = r + d[0] * i, cc = c + d[1] * i; if (rr < 0 || rr >= size || cc >= size || (grid[rr][cc] && grid[rr][cc] !== w[i])) { ok = false; break; } }
        if (!ok) continue;
        for (var j = 0; j < w.length; j++) grid[r + d[0] * j][c + d[1] * j] = w[j];
        placed.push(w); return;
      }
    });
    var L = 'ABCDEFGHIJKLMNOPRSTUVWY';
    for (var r2 = 0; r2 < size; r2++) for (var c2 = 0; c2 < size; c2++) if (!grid[r2][c2]) grid[r2][c2] = L[Math.floor(rnd() * L.length)];
    return { grid: grid, words: placed };
  }
  function WordSearch(props) {
    var s = useState(1), seed = s[0], setSeed = s[1];
    var ws = useMemo(function () { return makeGrid(props.words, 14, seed + props.words.join('').length); }, [props.words, seed]);
    return h('div', { className: 'jx-ws' },
      h('div', { className: 'jx-row jx-noprint' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setSeed(seed + 1); } }, 'New puzzle'), h('button', { type: 'button', className: 'primary', onClick: function () { window.print(); } }, 'Print worksheet')),
      h('h4', null, 'Word search: ' + props.title),
      h('table', { className: 'jx-ws-grid' }, h('tbody', null, ws.grid.map(function (row, i) { return h('tr', { key: i }, row.map(function (ch, j) { return h('td', { key: j }, ch); })); }))),
      h('p', { className: 'jx-ws-words' }, ws.words.join(' · ')));
  }
  function libCover(id) { return JNZX.art ? JNZX.art(id) : null; }
  function LibraryPage(props) {
    var o = useState(LIB[0].id), cur = o[0], setCur = o[1];
    var item = LIB.find(function (x) { return x.id === cur; }) || LIB[0];
    var showWs = useState(false), ws = showWs[0], setWs = showWs[1];
    return h('div', null,
      JNZX.Header('FAITH & HOPE · FAITH FORMATION LIBRARY', 'Learn and share the faith at home.', 'Clear guides to the Catholic faith for families, catechists and teachers, with printable word-search worksheets and ready-to-use family lesson plans.'),
      h(JNZX.Tabs, { id: 'faithlib', label: 'Library', items: [
        { id: 'topics', label: '📚 Topics', render: function () {
          return h('div', { className: 'jx-lib' },
            h('nav', { className: 'jx-lib-nav jx-noprint', 'aria-label': 'Topics' }, LIB.map(function (x) { return h('button', { key: x.id, type: 'button', className: x.id === cur ? 'is-on' : '', onClick: function () { setCur(x.id); setWs(false); } }, x.title); })),
            h('article', { className: 'jx-lib-main' }, libCover(item.id) && h('img', { className: 'jx-lib-cover', src: libCover(item.id), alt: '' }), h('h2', null, item.title), item.body(),
              h('div', { className: 'jx-row jx-noprint' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setWs(!ws); } }, ws ? 'Hide worksheet' : '🧩 Make a word-search worksheet'), h('button', { type: 'button', className: 'secondary', onClick: function () { window.print(); } }, 'Print this topic'), h(JNZX.ShareMini, { label: 'Share this topic', title: item.title, text: item.title + ' — a family faith guide from The James NZ', bg: libCover(item.id) })),
              ws && h(WordSearch, { title: item.title, words: item.words })));
        } },
        { id: 'lessons', label: '🧑‍🏫 Family lesson plans', render: function () {
          return h(JNZX.Accordion, { items: LESSONS.map(function (l) { return { title: l[0], meta: 'Ages ' + l[1], body: function () { return h('div', null,
            h('p', null, h('strong', null, 'Scripture: '), l[2]), h('p', null, h('strong', null, 'Goal: '), l[3]),
            h('p', null, h('strong', null, 'Opening: '), 'Make the Sign of the Cross and light a candle.'),
            h('h4', null, 'Activities'), ol(l[4]),
            h('p', null, h('strong', null, 'Closing prayer: '), l[5]),
            h('button', { type: 'button', className: 'secondary jx-noprint', onClick: function () { window.print(); } }, 'Print lesson')); } }; }) });
        } }
      ] }),
      h('p', { className: 'small-note' }, 'Original material by The James NZ, inspired by the range of topics families and catechists ask about. For official teaching, see the Catechism of the Catholic Church; for local programmes, contact your parish or diocese.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true }));
  }
  JNZX.register('x:faith-formation', LibraryPage);

  /* ======================= BIBLE DICTIONARY ======================= */
  var DR = { 'Joshua': 'Josue', '1 Samuel': '1 Kings', '2 Samuel': '2 Kings', '1 Kings': '3 Kings', '2 Kings': '4 Kings', '1 Chronicles': '1 Paralipomenon', '2 Chronicles': '2 Paralipomenon', 'Ezra': '1 Esdras', 'Nehemiah': '2 Esdras', 'Song of Solomon': 'Canticles', 'Isaiah': 'Isaias', 'Jeremiah': 'Jeremias', 'Ezekiel': 'Ezechiel', 'Hosea': 'Osee', 'Obadiah': 'Abdias', 'Jonah': 'Jonas', 'Micah': 'Micheas', 'Habakkuk': 'Habacuc', 'Zephaniah': 'Sophonias', 'Haggai': 'Aggeus', 'Zechariah': 'Zacharias', 'Malachi': 'Malachias', 'Revelation': 'Apocalypse', '1Macc': '1 Machabees', '2Macc': '2 Machabees', 'Sir': 'Ecclesiasticus', 'Wis': 'Wisdom', 'Tob': 'Tobias', 'Jdt': 'Judith', 'Bar': 'Baruch' };
  function psalmDR(n, v) { if (n <= 8 || n >= 148) return n; if (n === 9 || n === 10) return 9; if (n <= 113) return n - 1; if (n === 114 || n === 115) return 113; if (n === 116) return v && v >= 10 ? 115 : 114; if (n <= 146) return n - 1; return v && v >= 12 ? 147 : 146; }
  function verseText(ref) {
    try {
      var m = /^(.*?)\s+(\d+)(?::(\d+)(?:[-–](\d+))?)?$/.exec(ref); if (!m || typeof JAMES_BIBLE === 'undefined') return null;
      var book = m[1], ch = +m[2], v1 = m[3] ? +m[3] : 1, v2 = m[4] ? +m[4] : v1;
      if (/^(1Esd|2Esd|3Macc)$/.test(book)) return null;
      var b = DR[book] || book; if (book === 'Psalms') ch = psalmDR(ch, v1);
      var vs = JAMES_BIBLE.filter(function (x) { return x.book === b && x.chapter === ch && x.verse >= v1 && x.verse <= Math.min(v2, v1 + 5); });
      return vs.length ? { label: b + ' ' + ch + ':' + v1 + (v2 > v1 ? '–' + Math.min(v2, v1 + 5) : ''), text: vs.map(function (x) { return x.text; }).join(' ') } : null;
    } catch (e) { return null; }
  }
  function Ref(props) {
    var s = useState(false), open = s[0], set = s[1];
    var v = open ? verseText(props.r) : null;
    return h('span', { className: 'jx-ref' }, h('button', { type: 'button', onClick: function () { set(!open); }, 'aria-expanded': open }, props.r), open && h('span', { className: 'jx-ref-pop' }, v ? [h('strong', { key: 'l' }, v.label + ' (Douay–Rheims): '), v.text] : 'Verse text not available for this reference.'));
  }
  function BibleDictionaryPage(props) {
    var st = JNZX.useData('./data/bible-dictionary.json'), rows = st.data;
    var q = useState(''), qq = q[0], setQ = q[1];
    var k = useState('All'), kind = k[0], setKind = k[1];
    var l = useState('A'), letter = l[0], setLetter = l[1];
    var o = useState(null), open = o[0], setOpen = o[1];
    var pg = useState(0), page = pg[0], setPage = pg[1];
    var list = useMemo(function () {
      if (!rows) return [];
      var t = qq.trim().toLowerCase();
      return rows.filter(function (r) {
        if (kind !== 'All' && r.k !== kind) return false;
        if (t) return r.n.toLowerCase().indexOf(t) === 0 || (t.length > 3 && (r.n + ' ' + r.h).toLowerCase().indexOf(t) >= 0);
        return r.n[0].toUpperCase() === letter;
      });
    }, [rows, qq, kind, letter]);
    if (st.error) return h('p', { role: 'alert' }, st.error);
    var per = 60, pages = Math.max(1, Math.ceil(list.length / per)), p = Math.min(page, pages - 1);
    var entry = open && rows ? rows.find(function (r) { return r.n === open; }) : null;
    return h('div', null,
      JNZX.Header('FAITH & HOPE · BIBLE DICTIONARY', 'People, places and words of the Bible.', (rows ? rows.length.toLocaleString() : 'Thousands of') + ' entries from Easton’s Bible Dictionary, with the meanings of names from Hitchcock’s Bible Names. Tap a reference to read the verse.'),
      !rows ? h('p', { className: 'jx-muted' }, 'Loading the dictionary…') : h('div', { className: 'jx-bd' },
        h('div', { className: 'jx-row' }, h(JNZX.Search, { value: qq, onChange: function (v) { setQ(v); setPage(0); setOpen(null); }, placeholder: 'Search e.g. Abraham, Bethlehem, manna' })),
        h(JNZX.Chips, { label: 'Type', options: [{ value: 'All', label: 'All' }, { value: 'Person', label: '👤 People' }, { value: 'Place', label: '📍 Places' }, { value: 'Topic', label: '📜 Words & topics' }], value: kind, onChange: function (v) { setKind(v); setPage(0); } }),
        !qq && h('div', { className: 'jx-letters', role: 'group', 'aria-label': 'First letter' }, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (c) { return h('button', { key: c, type: 'button', className: c === letter ? 'is-on' : '', onClick: function () { setLetter(c); setPage(0); setOpen(null); } }, c); })),
        h('div', { className: 'jx-bd-layout' },
          h('div', null, h('p', { className: 'jx-muted' }, list.length + ' entries'),
            h('ul', { className: 'jx-bd-list' }, list.slice(p * per, p * per + per).map(function (r) { return h('li', { key: r.n }, h('button', { type: 'button', className: open === r.n ? 'is-on' : '', onClick: function () { setOpen(r.n); } }, r.n, h('small', null, r.k))); })),
            h(JNZX.Pager, { page: p, pages: pages, onPage: setPage })),
          h('div', { className: 'jx-bd-entry' }, entry ? h('article', { className: 'jx-card' },
            h('p', { className: 'eyebrow' }, entry.k.toUpperCase()), h('h2', null, entry.n),
            entry.h && h('p', null, h('strong', null, 'Meaning of the name: '), entry.h, h('small', { className: 'jx-muted' }, ' (Hitchcock)')),
            entry.e && h('p', { className: 'jx-bd-text' }, entry.e),
            entry.r && entry.r.length > 0 && h('div', null, h('h4', null, 'Bible references'), h('div', { className: 'jx-refs' }, entry.r.map(function (r) { return h(Ref, { key: r, r: r }); }))),
            h('p', { className: 'small-note' }, 'Easton’s Bible Dictionary (1897) reflects the scholarship of its time and a Protestant perspective; types (person/place/word) are sorted automatically and may occasionally be wrong. Verse text is from the Douay–Rheims Bible, whose book names and numbering sometimes differ.'))
            : h('div', { className: 'jx-card jx-muted' }, 'Choose an entry to read it.')))),
      h('p', { className: 'small-note' }, 'Sources: Easton’s Bible Dictionary (M. G. Easton, 1897) and Hitchcock’s Bible Names Dictionary (R. D. Hitchcock, 1869), both public domain; structured by the NEUU bible-dictionary-dataset (CC BY 4.0).'),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:bible-dictionary', BibleDictionaryPage);
})();
