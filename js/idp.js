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

var chart1 = $('#chart1').highcharts({
        chart: {
            backgroundColor: null,
            type: 'scatter'
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
            scatter: {
                pointStart: 1979
            }
        },
        credits: {
            enabled: false
        }
    }).highcharts();

$('#sea-ice').on('impress:stepenter', function () {
    if (chart1.series.length > 0) {
        return;
    }

    var series = {
        name: 'Antarctica',
        color: '#434348',
        animation: {
            duration: 2000,
            easing: 'easeOutQuad'
        },
        data: [11.728417582417578, 11.235768670309655, 11.41615300546448, 11.665360805860816, 11.370808743169395, 11.45306557377049, 11.633391941391945, 11.082500910746813, 13.214166320885202, 11.667904378531077, 11.428373698630136, 11.408416986301363, 11.547332054794524, 11.401591256830594, 11.41991342465753, 11.772208219178081, 11.80117753424657, 11.778013114754108, 11.389216986301374, 11.735927671232865, 11.758574794520557, 11.749790163934424, 11.670303561643838, 11.218835616438351, 11.971682739726026, 11.964190710382514, 11.698042739726027, 11.458327671232876, 11.673660273972594, 12.245780327868848, 12.050810410958904, 12.109685479452066, 11.497571506849312, 12.007301092896181, 12.515341369863007, {marker: {radius: 10}, y: 12.772173698630136}, 12.3829901098901]
    };

    chart1.addSeries(series);

});