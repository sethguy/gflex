


var savethenedit = function(bi) {

    console.log('bi is :  ' + JSON.stringify(bi));

    var urlstring = savebusinessurl + "/" + encodeURIComponent(JSON.stringify(bi));

    grabstuff(urlstring, function(stuff) {

        console.log(stuff);

        clearfields();
        showbiztoedit(stuff);
        pressideop({ 'name': 'ebu', 'title': 'Edit Business/User' });

            var urlstring2 = removebisugtourl + "/" + encodeURIComponent(JSON.stringify(bisugob));

            grabstuff(urlstring2, function(stuff) {


            }); // remove sug request


    }); //save request
}

var placechoices = function(ray, pdiv, con, pt) {

        con.inn('');

        for (var i = 0; i < ray.length; i++) {

            
            var varlet = ray[i];

            con.pend(pdiv(varlet, pt));

        };

    } //placechoices


var buildBiFromSug = function(bisugtn) {

        builded = {};

    } //buildBiFromSug

var sgtoptions = [
/*{

    name: 'Approve/Add',
    action: function(bi) {


        var urlstring = savebusinessurl + "/" + encodeURIComponent(JSON.stringify(buildBiFromSug(bi)));


        grabstuff(urlstring, function(stuff) {

            if (stuff.msg) {

                alert(stuff.msg)

            }

            var urlstring2 = removebisugtourl + "/" + encodeURIComponent(JSON.stringify(bisugob));

            grabstuff(urlstring2, function(stuff) {

                if (stuff.msg) {

                }

                loadbisugs();

            }); // remove sug request


        }); // save request


        var removeFromSugList = function(sug) {


        }

    }
}, */
{
    name: 'Approve/Add->Edit',
    action: function(bi) {

      //  delete bi._id;

              pressideop({ 'name': 'adb', 'title': 'Add Business' });

      if(bi.place_id)pushPlacebyId(bi.place_id);

       // savethenedit(bi)

    }
}, {

    name: 'Decline/Remove',

    action: function(bi) {

        var bisugob = bi;

        var urlstring = removebisugtourl + "/" + encodeURIComponent(JSON.stringify(bisugob));

        console.log(bi);

        grabstuff(urlstring, function(stuff) {

            if (stuff.msg) {

                alert(stuff.msg)

            }

            loadbisugs();

        }); // set request


    }

}]

var sugdiv = function(ob) {

    var dv = div().cl('suglet');
    console.log("ob in divs" + JSON.stringify(ob));
    console.log("ob name" + ob.name);
    console.log("ob biz" + ob.business);

    var na = "no name";

    if (ob.name) na = ob.name;

    dv.pend(

        el('table').pend(

            el('tr').pend(

                el('td').pend(

                    div().cl('sgtdiv').pend(

                        el('p').inn(na + "<br>" + ob.address + "<br>" + ob.one)

                    )

                )

            ).pend(

                el('td').pend(

                    div().cl('sgtdiv').props({
                        id: 'sgtdiv'
                    }).pend(sugrow(ob)

                        // el('p').inn('click here to note that business is verified')

                    )
                ).prop('onmousedown', function() {


                }) //on mouse down
            )

        ) //table

    ); //pend on sugdiv

    return dv;
}

var sugrow = function(bi) {
    return div().cl('sug-row row').props({
        id: 'sugrow_' + bi._id
    }).pendray(sgtoptions, function(op) {

        return div().cl('sug-option col-xs-6').pend(
            el('p').inn(op.name)
        ).props({
            onmousedown: function() {
                op.action(bi);
            }
        })
    })

}
