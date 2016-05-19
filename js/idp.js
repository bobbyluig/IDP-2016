$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

$.extend($.easing, window.easing);
$.extend(Math, window.easing);

$(document).ready(function () {
    impress().init();
});

function animate_number(number, backward) {
    number = $(number);

    var decimal_places = Number(number.data('places')) || 0;
    var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);
    var duration = Number(number.data('duration')) || 1000;

    var start, end;

    if (!backward) {
        start = Number(number.data('start')) || 0;
        end = Number(number.data('end')) || 100;
    }
    else {
        end = Number(number.data('start')) || 0;
        start = Number(number.data('end')) || 100;
    }

    number.prop('number', start);

    number.animateNumber({
        number: end * decimal_factor,
        easing: 'easeInCubic',
        numberStep: function (now, tween) {
            var floored_number = Math.floor(now) / decimal_factor,
                target = $(tween.elem);

            if (decimal_places > 0) {
                floored_number = floored_number.toFixed(decimal_places);
            }

            target.text(floored_number);
        }
    }, duration);
}

var chart = $('#ice-chart1').highcharts({
        chart: {
            backgroundColor: null,
            type: 'column'
        },
        title: {
            text: 'Average Sea Ice'
        },
        subtitle: {
            text: '(Area of ocean with at least 15% sea ice)'
        },
        xAxis: {
            title: {
                text: 'Year'
            }
        },
        yAxis: {
            title: {
                text: 'Extent (Millions of square kilometers)'
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointStart: 1979
            }
        },
        credits: {
            enabled: false
        }
    }).highcharts();

$('#sea-ice').on('impress:stepenter', function () {
    var series = [{
        name: 'Arctic',
        color: '#434348',
        animation: {
            duration: 2000,
            easing: 'easeOutQuad'
        },
        data: [12.324774725274722, 12.338326047358835, 12.1395446265938, 12.442619047619038, 12.339357012750462, 11.916231329690342, 11.987734432234436, 12.20754826958105, 11.193628630705396, 12.096983992467052, 11.968052054794521, 11.69676767123288, 11.747077260273974, 12.110460655737702, 11.92276547945205, 12.010785205479449, 11.415206027397254, 11.840980327868852, 11.666148493150677, 11.758354520547956, 11.693895342465755, 11.507803825136623, 11.599518356164383, 11.362902465753422, 11.398157260273976, 11.242261748633878, 10.907015890410955, 10.77260383561644, 10.474143013698631, 10.978075956284142, 10.931358904109587, 10.7142202739726, 10.480511232876708, 10.40720546448087, 10.897502465753425, 10.789553424657534, 10.585684931506849]
    }, {
        name: 'Antarctica',
        color: '#7cb5ec',
        animation: {
            duration: 2000,
            easing: 'easeOutQuad'
        },
        data: [11.728417582417578, 11.235768670309655, 11.41615300546448, 11.665360805860816, 11.370808743169395, 11.45306557377049, 11.633391941391945, 11.082500910746813, 13.214166320885202, 11.667904378531077, 11.428373698630136, 11.408416986301363, 11.547332054794524, 11.401591256830594, 11.41991342465753, 11.772208219178081, 11.80117753424657, 11.778013114754108, 11.389216986301374, 11.735927671232865, 11.758574794520557, 11.749790163934424, 11.670303561643838, 11.218835616438351, 11.971682739726026, 11.964190710382514, 11.698042739726027, 11.458327671232876, 11.673660273972594, 12.245780327868848, 12.050810410958904, 12.109685479452066, 11.497571506849312, 12.007301092896181, 12.515341369863007, 12.772173698630136, 12.3829901098901]
    }];
    series.forEach(function(item) {
        chart.addSeries(item, false);
    });
    chart.redraw();
}).on('impress:stepleave', function () {
    setTimeout(function () {
        while (chart.series.length > 0)
            chart.series[0].remove();
    }, 2000);
});