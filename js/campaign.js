var campaign_id = 0;

$(document).ready(function () {

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname !== "databank-poc.cf") {
        var domain = "http://databank-poc.cf"
    } else {
        var domain = ""
    }

    var settings = {
        "url": domain + "/get-campaign",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "user_id": "user@email.com"
        }),
    };

    $.ajax(settings).done(function (response) {
        $("#qtd_campaign").html($.parseJSON(response).length);
    });

    var forms = document.querySelectorAll('.needs-validation')

    $("#next_step_2").click(function (event) {
        event.preventDefault();
        $("#step_1_label").addClass("d-none");
        forms[0].classList.add('was-validated');
        if (forms[0].checkValidity()) {
            $("#step_1").hide();
            $("#dashboard").hide();
            $("#create_campaign").hide();
            $("#step_2").show();
        }
    });

    $('#states').on('change', function () {

        if (forms[0].checkValidity()) {
            $("#next_step_2").addClass("campaign-btn-validated");
        } else {
            $("#next_step_2").removeClass("campaign-btn-validated");
        }

        var html_load = "<div class=\"spinner-border text-primary\" role=\"status\">\n" +
            "  <span class=\"sr-only\">Loading...</span>\n" +
            "</div>"
        $(".leads_by_request").html(html_load);
        var data = []
        $.map($('#states').select2('data'), function (k, v) {
            data.push("'" + k.id + "'")
        });

        var settings = {
            "url": domain + "/get-leads",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "uf": data.join(","),
                "channel": "",
                "categ": "",
                "inv": 0
            }),
        };

        $.ajax(settings).done(function (response) {
            response = $.parseJSON(response);
            var html_finished = "<h2><span class = 'qtd_leads_uf' style=\"color: #E6007E\">" + response.qtd_leads + "</span> Leads</h2>"
            $(".leads_by_request").html(html_finished);
            $(".qtd_leads_uf").mask('#.##0', { reverse: true });
            $("#leads_selected").html(response.qtd_leads);

        });

    });


    $("#next_step_3").click(function (event) {
        event.preventDefault();
        $("#step_2_label_1").addClass("d-none");
        $("#step_2_label_2").addClass("d-none");
        forms[1].classList.add('was-validated');
        if (forms[1].checkValidity()) {
            $("#step_2").hide();
            $("#dashboard").hide();
            $("#create_campaign").hide();
            $("#step_3").show();
        }
    });

    $("#next_step_4").click(function (event) {
        event.preventDefault();
        $("#step_3_label_1").addClass("d-none");
        $("#step_3_label_2").addClass("d-none");
        forms[2].classList.add('was-validated');
        if (forms[2].checkValidity()) {
            $("#step_3").hide();
            $("#dashboard").hide();
            $("#create_campaign").hide();
            $("#step_4").show();
        }
    });

    $("#next_step_5").click(function (event) {
        var states_selected = [];
        $.each($("#states").select2('data'), function (e) {
            states_selected.push(this.text)
        });

        $("#states_selected").html(states_selected.join(", "));

        var products_selected = [];
        $.each($("#subcategorias").select2('data'), function (e) {
            products_selected.push(this.text)
        });

        $("#products_selected").html(products_selected.join(", "));

        $("#chanel_selected").html($("#canal").select2("data")[0].text);

        $("#startDate_selected").html($('#daterangepicker1').data('daterangepicker').startDate.format('DD/MM/YYYY'));
        $("#endDate_selected").html($('#daterangepicker1').data('daterangepicker').endDate.format('DD/MM/YYYY'));

        $("#investment_selected").html($("#valor_investimento").val());

        event.preventDefault();
        $("#step_4_label_1").addClass("d-none");
        forms[3].classList.add('was-validated');

        if (forms[3].checkValidity()) {
            $("#step_4").hide();
            $("#dashboard").hide();
            $("#create_campaign").hide();
            $("#step_5").show();
        } else {
            $("#step_4_label_2").addClass("text-area-label-red");
        }
    });

    $("#next_step_6").click(function (event) {
        event.preventDefault();
        $("#step_5_label").addClass("d-none");
        forms[4].classList.add('was-validated');
        if (forms[4].checkValidity()) {
            $("#step_5").hide();
            $("#dashboard").hide();
            $("#create_campaign").hide();
            $("#step_6").show();
        }
    });

    $("#next_step_7").click(function () {

        $("#campaign_name_selected").html($("#campaign_name").val());
        $("#step_6").hide();
        $("#dashboard").hide();
        $("#create_campaign").hide();
        $("#step_7").show();

        var states = [];
        $.map($('#states').select2('data'), function (k, v) {
            states.push(k.text);
        });

        var citys = [];
        $.map($('#cidades').select2('data'), function (k, v) {
            citys.push(k.text);
        });

        var subcategorias = [];
        $.map($('#subcategorias').select2('data'), function (k, v) {
            subcategorias.push(k.text);
        });

        var payment_values = [];
        $("div#pagamento_div div.form-group input.form-control").each(function () {
            payment_values.push(this.value);
        });

        var settings = {
            "url": domain + "/post-campaign",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "user_id": "user@email.com",
                "campaign_name": $("#campaign_name").val(),
                "uf": states.join(";"),
                "city": citys.join(";"),
                "consumption_category": $('#tipo_de_consumo').select2('data')[0].text,
                "consumption_subcategory": subcategorias.join(";"),
                "campaign_channel": $('#canal').select2('data')[0].text,
                "date_start": $('#daterangepicker1').data('daterangepicker').startDate.format('DD/MM/YYYY'),
                "date_finish": $('#daterangepicker1').data('daterangepicker').endDate.format('DD/MM/YYYY'),
                "campaign_values": "Mensagem",
                // "campaign_values": $("#smsInput").val(),
                "qtd_leads": $('#leads_selected').html().replace(".", ""),
                "investiment": $("#valor_investimento").val().replace("R$ ", "").replace(/\./g, "").replace(/\,/g, "."),
                "payment_method": $('#opcao_de_pagamento').select2('data')[0].text,
                "payment_values": payment_values.join(";")
            }),
        };

        $.ajax(settings).done(function (response) {
            console.log(response);

            response = JSON.parse(response);

            console.log(response);

            campaign_id = response.campaign_id;

            if ($('#canal').select2("data")[0].id === "SMS") {
                send_bulk_sms();
            }

            console.log(response);

            log_campaign_sent();

        });
    });

    $("#back_step_1").click(function (event) {
        event.preventDefault();
        $("#step_2").hide();
        $("#dashboard").hide();
        $("#create_campaign").hide();
        $("#step_1").show();
    });

    $("#back_step_2").click(function (event) {
        event.preventDefault();
        $("#step_3").hide();
        $("#dashboard").hide();
        $("#create_campaign").hide();
        $("#step_2").show();
    });

    $("#back_step_3").click(function (event) {
        event.preventDefault();
        $("#step_4").hide();
        $("#dashboard").hide();
        $("#create_campaign").hide();
        $("#step_3").show();
    });


    $("#back_step_4").click(function (event) {
        event.preventDefault();
        $("#step_5").hide();
        $("#dashboard").hide();
        $("#create_campaign").hide();
        $("#step_4").show();
    });

    $("#back_step_5").click(function (event) {
        event.preventDefault();
        $("#step_6").hide();
        $("#dashboard").hide();
        $("#create_campaign").hide();
        $("#step_5").show();
    });

    $("#btn_create_campaign").click(function () {
        clear_all_fields();
        $("#navbarSupportedContent > .navbar-nav").children().removeClass("nav-item-selected");
        $("ul li:nth-child(2)").addClass("nav-item-selected");
        $("#create_campaign").hide();
        $("#dashboard").hide();
        $("#create_campaign").hide();
        $("#step_1").show();
    });

    $("#home").click(function () {
        $("#step_1").hide();
        $("#step_2").hide();
        $("#step_3").hide();
        $("#step_4").hide();
        $("#step_5").hide();
        $("#step_6").hide();
        $("#step_7").hide();
        $("#dashboard").hide();
        $("#create_campaign").show();

    });

    $("#btn_obrigado").click(function () {
        // $("#navbarSupportedContent > .navbar-nav").children().removeClass("nav-item-selected");
        // $("ul li:nth-child(1)").addClass("nav-item-selected");
        // $("#step_1").hide();
        // $("#step_2").hide();
        // $("#step_3").hide();
        // $("#step_4").hide();
        // $("#step_5").hide();
        // $("#step_6").hide();
        // $("#step_7").hide();
        // $("#dashboard").hide();
        // $("#create_campaign").show();
        $(location).attr('href', "home.html");

    });

    $("#btn_dashboard").click(function () {

        var settings = {
            "url": domain + "/get-campaign-results",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({}),
        };

        $.ajax(settings).done(function (response) {
            response = $.parseJSON(response);
            var data = [];
            $.each(response, function (index, value) {
                data.push({ "id": this.id, "text": this.campaign_name });
            });


            $('#campaign_results_select').select2({
                placeholder: 'Selecione uma campanha',
                width: '100%',
                data: data
            });

            $("#campaign_results_select").on('change', function (e) {
                var id = $('#campaign_results_select').select2('data')[0].id;
                var element = "";
                $.each(response, function (index, value) {
                    if (this.id === id) {
                        element = this;
                        return
                    }
                });

                $("#cpv").html("R$ " + element.cpv.replace(".", ","))
                $("#cpc").html("R$ " + element.cpc.replace(".", ","))
                $("#cpa").html("R$ " + element.cpa.replace(".", ","))
                $("#roi").html("R$ " + element.roi.replace(".", ","))
                $("#efi").html(element.efi.replace(".", ",") + "x")

                const data = {
                    labels: element.label_date.split(";"),
                    datasets: [{
                        data: element.campaign_results.split(";"),
                        label: '',
                        backgroundColor: [
                            '#70A5FF',
                            '#70A5FF',
                            '#70A5FF',
                            '#70A5FF',
                            '#70A5FF',
                            '#70A5FF',
                            '#70A5FF'
                        ],
                        borderRadius: 15
                    }]
                };


                const config = {
                    type: 'bar',
                    data: data,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }, plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                };

                const chart = Chart.getChart("myChart");

                if (chart) {
                    chart.destroy();
                }

                var myChart = new Chart(
                    document.getElementById('myChart'),
                    config
                );

                const data2 = {
                    labels: [
                        'Disponível',
                        'Realizado'
                    ],
                    datasets: [{
                        data: [element.investment_available, element.investment_realized],
                        backgroundColor: [
                            '#FFD2F0',
                            '#70a5ff'
                        ],
                        hoverOffset: 4,
                        borderRadius: 10,
                        rotation: 320
                    }]
                };

                const config2 = {
                    type: 'doughnut',
                    data: data2,
                    options: {
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom'
                            }
                        }
                    }
                };

                const chart2 = Chart.getChart("myChart2");

                if (chart2) {
                    chart2.destroy();
                }

                var myChart = new Chart(
                    document.getElementById('myChart2'),
                    config2
                );

            });


        });

        $("#navbarSupportedContent > .navbar-nav").children().removeClass("nav-item-selected");
        $("ul li:nth-child(4)").addClass("nav-item-selected");
        $("#step_1").hide();
        $("#step_2").hide();
        $("#step_3").hide();
        $("#step_4").hide();
        $("#step_5").hide();
        $("#step_6").hide();
        $("#step_7").hide();
        $("#create_campaign").hide();
        $("#dashboard").show();

    });

    $("#card_number").mask('9999 9999 9999 9999');
    $("#card_validate").mask('99/99');
    $("#card_cvv").mask('999');


    $('.js-example-basic-multiple').select2({
        placeholder: 'Selecione um estado',
        width: '100%'
    });
    $('#cidades').select2({
        placeholder: 'Todas as cidades',
        width: '100%'
    });


    var settings = {
        "url": domain + "/get-categ",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({}),
    };

    $.ajax(settings).done(function (response) {
        var data = $.parseJSON(response);
        $('#subcategorias').select2({
            placeholder: 'Subcategorias',
            width: '100%',
            data: data

        });

    });

    $('#tipo_de_consumo').select2({
        placeholder: 'Categoria de Produto',
        width: '100%'
    });

    $('#canal').select2({
        placeholder: 'Canal',
        width: '100%'
    });

    $('#opcao_de_pagamento').select2({
        placeholder: 'Método de Pagamento',
        width: '100%'
    });


    $("#valor_investimento").maskMoney();

    $("#valor_investimento").on("keypress", function (e) {

        if (e.keyCode == 13) {
            e.preventDefault();
            $("#canal").trigger("change");
        }
    });

    $("#campaign_name").on("keypress", function (e) {

        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });



    $("#valor_investimento").on('change', function (e) {
        $("#canal").trigger("change");
        if ($("#canal").select2('data').length === 0) {
            $("#next_step_4").removeClass("campaign-btn-validated");
        } else {
            $("#next_step_4").addClass("campaign-btn-validated");
        }
    });



    $("#opcao_de_pagamento").on('change', function (e) {

        if ($("#opcao_de_pagamento").val() === "cartao") {
            $("#pagamento_div").show();
        } else {
            $("#pagamento_div").hide();
        }
    });



    $('#canal').on('change', function (e) {

        if (forms[2].checkValidity()) {
            $("#next_step_4").addClass("campaign-btn-validated");
        } else {
            $("#next_step_4").removeClass("campaign-btn-validated");
        }

        var html_load = "<div class=\"spinner-border text-primary\" role=\"status\">\n" +
            "  <span class=\"sr-only\">Loading...</span>\n" +
            "</div>"
        $(".leads_by_request").html(html_load);
        var data = []
        $.map($('#states').select2('data'), function (k, v) {
            data.push("'" + k.id + "'")
        });

        var channel = $("#canal").select2('data')[0].id;
        var categ = [];
        var invest = $("#valor_investimento").val().replace("R$ ", "").replace(".", "").replace(",", ".");
        if (invest === "") {
            invest = 99999999999;
        }
        $.map($('#subcategorias').select2('data'), function (k, v) {
            categ.push(k.id);
        });


        var settings = {
            "url": domain + "/get-leads",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "uf": data.join(","),
                "channel": channel,
                "categ": categ.join(","),
                "inv": parseFloat(invest)
            }),
        };

        $.ajax(settings).done(function (response) {
            response = $.parseJSON(response);
            var html_finished = "<h2><span class = 'qtd_leads_uf' style=\"color: #E6007E\">" + response.qtd_leads + "</span> Leads</h2>"
            $(".leads_by_request").html(html_finished);
            $(".qtd_leads_uf").mask('#.##0', { reverse: true });
            $("#leads_selected").html(response.qtd_leads);

        });
    });

    const inputFieldTwo = document.querySelector("#smsInput");
    // if (inputFieldTwo === null) {return}
    inputFieldTwo.addEventListener('input', () => {

        if (forms[3].checkValidity()) {
            $("#next_step_5").addClass("campaign-btn-validated");
        } else {
            $("#next_step_5").removeClass("campaign-btn-validated");
        }

        var smsInput = $("#smsInput").val();
        const displaySmsText = document.getElementById("displaySmsText");
        displaySmsText.innerHTML = smsInput.replace(/\n/g, "<br>");
        
        if (smsInput.length === 0) {
            $("#sms-char-count").addClass("d-none");
            $("#step_4_label_2").html('Por favor, digite uma mensagem');
            $("#step_4_label_2").removeClass("d-none");
            $("#step_4_label_2").addClass("text-area-label-red");
        } else {
            $("#step_4_label_2").addClass("d-none");
            $("#sms-char-count").removeClass("d-none");
            $("#sms-char-count").html(`${smsInput.length}/160`);
        }
    });

    const inputField = document.querySelector("#states");
    const statesInMap = document.querySelectorAll("#svg-map .estados");
    const stateInput = inputField.value;
    $('#tipo_de_consumo').on('change', function (e) {

        if (forms[1].checkValidity()) {
            $("#next_step_3").addClass("campaign-btn-validated");
        } else {
            $("#next_step_3").removeClass("campaign-btn-validated");
        }

        if ($('#tipo_de_consumo').select2('data')[0].id === "Categoria de Produto") {
            $(".product_img").attr("src", "images/Group 13.png");
        }
        else {
            $(".product_img").attr("src", "images/product-img.svg");
        }
    });

    $('#campaign_name').on('change', function (e) {
        if (forms[4].checkValidity()) {
            $("#next_step_6").addClass("campaign-btn-validated");
        } else {
            $("#next_step_6").removeClass("campaign-btn-validated");
        }
    });

    $('#subcategorias').on('change', function (e) {
        if (forms[1].checkValidity()) {
            $("#next_step_3").addClass("campaign-btn-validated");
        } else {
            $("#next_step_3").removeClass("campaign-btn-validated");
        }
    });

    $('#states').on('change', function (e) {

        document.querySelectorAll(`#svg-map path`).forEach((e) => {
            e.style.fill = "#fff";
        });
        document.querySelectorAll(`#svg-map .circle`).forEach((e) => {
            e.style.fill = "#66ccff";
        });

        $('#states').select2('data').forEach((state) => {

            if (state.id === 'XX') {
                document.querySelectorAll(`#svg-map path`).forEach((e) => {
                    e.style.fill = "#e0ecff";
                });
                document.querySelectorAll(`#svg-map .circle`).forEach((e) => {
                    e.style.fill = "#e0ecff";
                });
            } else if (state.id) {
                document.querySelector(`#svg-map #${state.id} path`).style.fill = "#e0ecff";
                if (document.querySelector(`#svg-map #${state.id} .circle`)) {
                    document.querySelector(`#svg-map #${state.id} .circle`).style.fill = "#e0ecff";
                }
            } else {
                document.querySelector(`#svg-map #${state.id} path`).style.fill = "white";
                if (document.querySelector(`#svg-map #${state.id} .circle`)) {
                    document.querySelector(`#svg-map #${state.id} .circle`).style.fill = "#fff";
                }
            }
        })
    });

    !function (a) { a.fn.datepicker.dates["pt-BR"] = { days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"], daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"], daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"], months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], today: "Hoje", monthsTitle: "Meses", clear: "Limpar", format: "dd/mm/yyyy" } }(jQuery);
    $('.input-daterange').datepicker({
        format: "dd/mm/yyyy",
        language: "pt-BR",
        startDate: "today",
        orientation: "top auto"
    });
    $('.input-daterange2').datepicker({
        format: "dd/mm/yyyy",
        language: "pt-BR",
        startDate: "today",
        orientation: "top auto"
    });

    // Dashboards

    const data = {
        labels: ['10/06/2021', '14/06/2021', '21/06/2021', '25/06/2021', '30/06/2021'],
        datasets: [{
            data: [35789, 49624, 67251, 75054, 89524],
            label: '',
            backgroundColor: [
                '#70A5FF',
                '#70A5FF',
                '#70A5FF',
                '#70A5FF',
                '#70A5FF',
                '#70A5FF',
                '#70A5FF'
            ],
            borderRadius: 15
        }]
    };


    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }, plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    const data2 = {
        labels: [
            'Disponível',
            'Realizado'
        ],
        datasets: [{
            data: [10500, 24500],
            backgroundColor: [
                '#FFD2F0',
                '#70a5ff'
            ],
            hoverOffset: 4,
            borderRadius: 10,
            rotation: 250
        }]
    };

    const config2 = {
        type: 'doughnut',
        data: data2,
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart2'),
        config2
    );

    /* init daterangepicker */
    var picker = $('#daterangepicker1').daterangepicker({
        "parentEl": "#daterangepicker1-container",
        "autoApply": true
    });
    $('input[name="daterange"]').daterangepicker({
        "locale": {
            "format": "YYYY-MM-DD",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "De",
            "toLabel": "Até",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
                "Dom",
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sáb"
            ],
            "monthNames": [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro"
            ],
            "firstDay": 1
        }
    });
    // range update listener
    picker.on('apply.daterangepicker', function (ev, picker) {
        $("#daterangepicker-result").html('Selected date range: ' + picker.startDate.format('YYYY-MM-DD') + ' to ' + picker.endDate.format('YYYY-MM-DD'));
    });
    // prevent hide after range selection
    picker.data('daterangepicker').hide = function () { };
    // show picker on load
    picker.data('daterangepicker').show();


});

function clear_all_fields() {
    $('#states').val(null).trigger('change');
    $('#cidades').val(null).trigger('change');
    $('#subcategorias').val(null).trigger('change');
    $('#canal').val(null).trigger('change');
    $('#opcao_peca').val(null).trigger('change');
    $('#opcao_de_pagamento').val(null).trigger('change');
    $('#displaySmsText').html("");

    $("form").each(function (index) {
        $("form")[index].reset();
        $("form")[index].classList.remove("was-validated");
    });

    document.querySelectorAll(".in-range").forEach(function (e) { e.classList.remove("in-range"); });

    $(".active").each(function (index) {
        try {
            $(".active")[index].classList.remove("active");
        } catch (e) {
            return
        }
    });

    $('#daterangepicker1').data('daterangepicker').startDate = moment();
    $('#daterangepicker1').data('daterangepicker').endDate = moment();




}

function log_campaign_sent() {

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname !== "databank-poc.cf") {
        var domain = "http://databank-poc.cf"
    } else {
        var domain = ""
    }

    var settings = {
        "url": domain + "/post-campaign-sent-log",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "campaign_id": campaign_id,
            "campaign_channel": $('#canal').select2("data")[0].id,
            "message": "Mensagem",
            // "message": $("#smsInput").val(),
            "send_date": new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
        }),
    };

    console.log(settings)

    $.ajax(settings).done(function (response) {
        console.log(response);
    });

    return;
}

function send_bulk_sms() {

    var settings = {
        "url": "https://databankroot-eval-prod.apigee.net/sms/v1/bulk-send",
        "method": "POST",
        "timeout": 1200,
        "headers": {
            "Content-Type": "application/json",
            "x-apikey": "VpSIHy64EFLhfXsGAx88myPQ9yZDY2O1"
        },
        "data": JSON.stringify({
            "messageText": $("#smsInput").val()
        }),
    };

    $.ajax(settings)
        .done(function (response) {
            console.log(response);
            try {
                if (response.tokenId != '') {
                    console.log('SMS Enviado');
                }
            } catch (error) {
                alert('erro!')
            }
        })
        .fail(function () {
            console.log('Erro na chamada ao apigee')
        });
}
