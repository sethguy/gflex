var specialImgs = [

    { 'name': 'glass' },
    { 'name': 'straw' },
    { 'name': 'knife' }

];

var openSpecialInEditMode = function(spe) {

        get('sp-bi-title').value = "";
        get('sp-terms').value = "";
        get('spCal').currentDate = new Date().getTime();
        get('spCal').startDate = new Date().getTime();

        get('specialModal').spe = null

        var ray = [

            { act: 'Month', name: 'month', min: "1", max: "12" },

            { act: 'Date', name: 'day', min: "1", max: "31" },

            { act: 'Year', name: 'year', min: "1970", max: "3000" }

        ];

        for (var i = 0; i < ray.length; i++) {

            var id = ray[i].name + '_StartcalField';
            get(id).value = ""

            id = ray[i].name + '_calField';

            get(id).value = ""

        }

        get('specialModal').spe = spe;

        get('sp-bi-title').value = spe.name;
        get('sp-terms').value = spe.terms;
        get('spCal').currentDate = spe.experationDate;
        get('spCal').startDate = spe.start;
        get("wpcontainer").biz;

        get('selectedCatPart').props({
            cat: spe.cat,
            src: 'business/images/specials/' + spe.cat + '.png'
        });

        get('image-select-preview').props({
            imgName: spe.img
        }).stProps({
            backgroundImage: "url('/business/images/specials/" + spe.img + "Small.png')"
        })

        var ray = [

            { act: 'Month', name: 'month', min: "1", max: "12" },

            { act: 'Date', name: 'day', min: "1", max: "31" },

            { act: 'Year', name: 'year', min: "1970", max: "3000" }

        ];

        for (var i = 0; i < ray.length; i++) {

            var id = ray[i].name + '_StartcalField';
            get(id).value = new Date(spe.start)['get' + ray[i].act]() + (ray[i].name === 'month' ? 1 : 0) + (ray[i].name === 'year' ? 1900 : 0);

            id = ray[i].name + '_calField';

            get(id).value = new Date(spe.experationDate)['get' + ray[i].act]() + (ray[i].name === 'month' ? 1 : 0) + (ray[i].name === 'year' ? 1900 : 0);

        }

        showAddEditSpecial();

    } //openSpecialInEditMode

var getSpecialsList = function() {

        var listUrl = getSpecialsByBid + '/' + get("wpcontainer").biz._id

        grabstuff(listUrl, function(res) {

                get('specialsFade').stProps({
                    zIndex: '-1',
                    display: 'none'
                })

                get('spListTab').inn('').pendray(res, function(spe, dex, ray) {

                    return el('tr').cl('spListlet')

                    .pend(

                        el('td').pend(

                            el('p').cl('spTitleTd').inn(spe.name)

                        ).props({
                            onmousedown: function(event) {

                                if (event.target.className !== "deletebutton") openSpecialInEditMode(spe);

                            }

                        })
                    )

                    .pend(

                        el('td').pend(

                            el('img').cl('spListImg')
                            .props({
                                src: 'business/images/specials/' + spe.img + 'Small.png'
                            })

                        ).props({
                            onmousedown: function(event) {

                                if (event.target.className !== "deletebutton") openSpecialInEditMode(spe);

                            }

                        })

                    ).pend(

                        el('td').cl('spCatListTd').pend(

                            el('img').cl('spCatListImg')
                            .props({
                                src: 'business/images/specials/' + spe.cat + '.png'
                            })

                        )

                    ).pend(

                        el('td').cl('spCatListTd').pend(

                            el('img').cl("deletebutton")
                            .props({
                                src: 'business/images/delete.svg',

                            })

                        ).props({
                            onmousedown: function() {

                                    deleteSpecial(spe)

                                } //
                        })

                    );

                }, 'specials')

            }) //grab stuff

    } //getSpecialsList


var deleteSpecial = function(spe) {


    get('specialsFade').stProps({
        zIndex: '99',
        display: 'block'
    })

    div().async({
        url: deleteSpecialUrl + '/' + spe._id,
        drop: function(res) {


            console.log(res);
            getSpecialsList();

        }
    })


}

var showspecialmodal = function() {

        console.log('show specials')

        get('specialModal').style.display = "block"

        get('sp-bi-name').inn(get("wpcontainer").biz.business);

        get('sp-image-select').inn('').pend(el('tr')

            .pendray(specialImgs,

                function(spec, dex, specialImgs) {

                    var imgsrc = 'business/images/specials/' + spec.name + 'Small' + '.png'

                    var speImglet = el('td').cl('sptd').pend(

                        div().cl('speImglet').pend(el('img').cl('speImg').prop('src', imgsrc))

                    ).prop('onmousedown', function() {

                        specilImgSelect(dex);

                    })

                    return speImglet
                },

                'imgs')

        ); // image select init

        var spcon = get('spCal-con').inn('').pend(spCal(), 'cal')

        spcon.cal.render();

        getSpecialsList();

        get('selectedCatPart').cat = "Dinner"

    } //showspecialmodal
    /*                        .pend(el('input').cl('spFieldPut')

                                .props({

                                    onkeyup: function() {

                                        console.log('key up');

                                        var da = new Date();

                                        for (var i = 0; i < ray.length; i++) {

                                            var id = ray[i].name + '_calField';

                                            console.log(id + " ::: at id  ");

                                            console.log(get(id).value);

                                            da['set' + ray[i].act](get(id).value - (ray[i].name === 'month' ? 1 : 0));

                                        }

                                        get('testP').inn(da.toDateString());

                                        get('spCal').currentDate = da.getTime();

                                    },
                                    min: field.min,
                                    max: field.max,
                                    id: field.name + '_calField',
                                    'placeholder': field.name,
                                    type: 'number'
                                })

                            )*/
var spCal = function(DateObj) {
        return div().cl('spCal').props({
            'currentDate': new Date().getTime(),
            id: 'spCal',
            setFull: function(time) {


            },
            setMonth: function(num, bt) {

                return get('spCal').
                prop('currentDate',
                    new Date(get('spCal').currentDate)
                    .setMonth((num != null) ? num : new Date(get('spCal').currentDate).getMonth() + (bt.num)).getTime())

            },
            setDate: function(num) {
                //var date = new Date( get('spCal').currentDate ).setDate(num);
                return get('spCal').
                prop('currentDate',
                    new Date(get('spCal').currentDate)
                    .setDate(num).getTime())
            },
            setYear: function(num, el) {
                return get('spCal').
                prop('currentDate',
                    new Date(get('spCal').currentDate)
                    .setYear((num != null) ? num : new Date(get('spCal').currentDate).getYear() + (bt.num)).getTime())
            },
            render: function() {

                return get('spCal').pend(

                    el('p').inn('Start Date')

                ).pend(

                    el('table').cl('spTab').pend(

                        el('tr').pendray([

                            { act: 'Month', name: 'month', min: "1", max: "12" },

                            { act: 'Date', name: 'day', min: "1", max: "31" },

                            { act: 'Year', name: 'year', min: "1970", max: "3000" }

                        ], function(field, dex, ray) {

                            return el('td').cl('spTabTdField').pend(el('input').cl('spFieldPut')

                                    .props({

                                        onkeyup: function() {

                                            console.log('key up');

                                            var da = new Date();

                                            for (var i = 0; i < ray.length; i++) {

                                                var id = ray[i].name + '_StartcalField';

                                                console.log(id + " ::: at id  ");

                                                console.log(get(id).value);

                                                da['set' + ray[i].act](get(id).value - (ray[i].name === 'month' ? 1 : 0));

                                            }

                                            //  get('testPStart').inn(da.toDateString());

                                            get('spCal').startDate = da.getTime();

                                        },
                                        min: field.min,
                                        max: field.max,
                                        id: field.name + '_StartcalField',
                                        'placeholder': field.name,
                                        type: 'number'
                                    })

                                ) //td return

                        }), 'Startrow')

                ).pend(

                    el('p').inn('Expiration Date')

                ).pend(

                    el('table').cl('spTab').pend(

                        el('tr').pendray([

                            { act: 'Month', name: 'month', min: "1", max: "12" },

                            { act: 'Date', name: 'day', min: "1", max: "31" },

                            { act: 'Year', name: 'year', min: "1970", max: "3000" }

                        ], function(field, dex, ray) {

                            return el('td').cl('spTabTdField').pend(el('input').cl('spFieldPut')

                                    .props({

                                        onkeyup: function() {

                                            console.log('key up');

                                            var da = new Date();

                                            for (var i = 0; i < ray.length; i++) {

                                                var id = ray[i].name + '_calField';

                                                console.log(id + " ::: at id  ");

                                                console.log(get(id).value);

                                                da['set' + ray[i].act](get(id).value - (ray[i].name === 'month' ? 1 : 0));

                                            }

                                            //  get('testP').inn(da.toDateString());

                                            get('spCal').currentDate = da.getTime();

                                        },
                                        min: field.min,
                                        max: field.max,
                                        id: field.name + '_calField',
                                        'placeholder': field.name,
                                        type: 'number'
                                    })

                                ) //td return

                        }), 'exprow')

                )

                .pend(el('p').cl('testP').props({ 'id': 'testPStart' }))

                .pend(el('p').cl('testP').props({ 'id': 'testP' }))


                /*
                .pend(el('table').cl('spTab').pendray(  [0, 1, 2, 3, 4], function(rnum) {

                                                return el('tr').cl('spTabRow').pendray( [0, 1, 2, 3, 4, 5, 6] , function(dnum) {

                                                    return el('td').cl('spTabTd').pend(   div().cl('spTabTdCon').pend(   el('span').inn(   (    (rnum * 6) + rnum) + dnum    ).props({

                                                        'id': (((rnum * 6) + rnum) + dnum) + "calbox",

                                                        onmousedown: function() {

                                                            var cb = get((((rnum * 6) + rnum) + dnum) + "calbox");

                                                            get('spCal').setDate(cb.dateNum || new Date(get('spCal').currentDate).getDate())

                                                        }

                                                    })))

                                                })

                                            }), 'spTab')
                                        */

            }


        });
    } //spCal


var showSpecialsList = function() {


        get('specialModalAdd').stProps({ display: 'none' });

        getSpecialsList();


        get('specialModalList').stProps({ display: 'block' });


    } //showSpecialsList


var showAddEditSpecial = function(clear) {


        if (clear) {


            get('sp-bi-title').value = "";
            get('sp-terms').value = "";
            get('spCal').currentDate = new Date().getTime();
            get('spCal').startDate = new Date().getTime();

            get('specialModal').spe = null

            var ray = [

                { act: 'Month', name: 'month', min: "1", max: "12" },

                { act: 'Date', name: 'day', min: "1", max: "31" },

                { act: 'Year', name: 'year', min: "1970", max: "3000" }

            ];

            for (var i = 0; i < ray.length; i++) {

                var id = ray[i].name + '_StartcalField';
                get(id).value = ""

                id = ray[i].name + '_calField';

                get(id).value = ""

            }


        }


        get('specialModalList').stProps({ display: 'none' });
        get('specialModalAdd').stProps({ display: 'block' });


    } //showAddEditSpecial


var specilImgSelect = function(dex) {

        var spi = specialImgs[dex];

        console.log('sp select  ::  ' + spi.name)

        var src = "url('/business/images/specials/" + spi.name + "Small.png')";

        console.log('sp select  :::   ' + src)

        get('image-select-preview').stProps({ backgroundImage: src }).props({ imgName: spi.name });


    } //specilImgSelect


function spec_searchbibyname(ev, ele) {
    console.log("key code :" + ev.keyCode);
    var kc = ev.keyCode;
    /*
    if( kc===38 || kc ===40 ){


    return;
    }
    */
    var word = ele.value;
    var rcon = get('spec_bizultscon').stprop('display', 'block'); //.inn("");

    if (word.length > 0) {
        var lowterm = ele.value.toLowerCase();
        if (!get('adiv').bizlist) {

            var urlstring = GetBizByNameUrl + "/" + word;

            grabstuff(urlstring, function(stuff) {

                    //console.log(JSON.stringify(stuff));

                    //var matches = stuff.matches;
                    //var term = 

                    console.log(word + "  word n term   " + ele.value);

                    if (word !== ele.value) {


                        console.log('caugth');

                    }

                    if (word === ele.value) {
                        console.log('all clear');
                        get('spec_bizultscon').inn("");

                        for (var i = 0; i < stuff.length; i++) {
                            var bi = stuff[i];


                            if (ele.value.length > 0) {

                                rcon.pend(

                                    spec_bizult(bi).prop("id", 'bzult' + i)

                                );

                            } // q ck


                        };


                    } //if word ===term


                }) //request

        } else {

            var list = get('adiv').bizlist;

            get('spec_bizultscon').inn("");
            for (var i = 0; i < list.length; i++) {
                var bi = list[i].bi;

                if (bi.loname.indexOf(lowterm) > -1 && ele.value.length > 0) {

                    rcon.pend(

                        spec_bizult(bi)

                    );

                } // q ck

            };


        } // check for a bizlist to pull from

    } else {

        get('spec_bizultscon').stprop('display', 'none').inn("");

    } //length ck


} //searchbibyname

var closeSpecialsModals = function() {

        get('specialModal').style.display = "none"

    } //closeSpecialsModals


var sendSpecial = function() {

        var specialToSend = {

            _id: get('specialModal').spe ? get('specialModal').spe._id : null,
            name: get('sp-bi-title').value,
            terms: get('sp-terms').value,
            start: get('spCal').startDate,
            experationDate: get('spCal').currentDate,
            bid: get("wpcontainer").biz._id,
            cat: get('selectedCatPart').cat,
            img: get('image-select-preview').imgName || 'straw'

        };

        console.log(JSON.stringify(specialToSend))

        var url = sendSpecialUrl + '/' + encodeURIComponent(JSON.stringify(specialToSend));

            get('specialsFade').stProps({
                zIndex: '99',
                display: 'block'
            })

        grabstuff(url, function(res) {

            get('specialsFade').stProps({
                zIndex: '-1',
                display: 'none'
            })

                get('sp-bi-title').value = "";
                get('sp-terms').value = "";
                get('spCal').currentDate = new Date().getTime();
                get('spCal').startDate = new Date().getTime();
                get("wpcontainer").biz;

                get('specialModal').spe = null

                get('selectedCatPart').props({
                    cat: "Dinner",
                    src: 'business/images/specials/Dinner.png'
                })

                get('image-select-preview').props({
                    imgName: "straw"
                }).stProps({
                    backgroundImage: "url('/business/images/specials/strawSmall.png')"
                })

                var ray = [

                    { act: 'Month', name: 'month', min: "1", max: "12" },

                    { act: 'Date', name: 'day', min: "1", max: "31" },

                    { act: 'Year', name: 'year', min: "1970", max: "3000" }

                ];

                for (var i = 0; i < ray.length; i++) {

                    var id = ray[i].name + '_StartcalField';
                    get(id).value = ""

                    id = ray[i].name + '_calField';

                    get(id).value = ""

                }

            }) // grabstuff

    } //sendSpecial


var selectCatImg = function(cat) {

        get('selectedCatPart').src = 'business/images/specials/' + cat + '.png';
        get('selectedCatPart').cat = cat;

    } //selectCatImg

function spec_bizult(bi) {

    var bz = div().cl('bizult').pend(

        el('p').inn(bi.business)

    ).prop('onmousedown', function() {

        spec_firebizselection(bi);

        get('sp-bi-put').value = bi.business;

        get('spec_bizultscon').stprop('display', 'none').inn("");

    });

    return bz;
} //bizult


function spec_firebizselection(bi) {

    console.log(JSON.stringify(bi) + "  fire biz spec");

    get('specialModal').bi = bi;

    get('sp-bi-name').inn(bi.business);
    get('sp-bi-address').inn(bi.address);


} //firebizselection
