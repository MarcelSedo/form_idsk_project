document.addEventListener("DOMContentLoaded", function() {
  // keďže sme klasy, chytíme si naše classy queryselectormi
  const steps = document.querySelectorAll(".govuk-stepper .govuk-step");
  const forms = [
    document.querySelector(".govuk-form1"),
    document.querySelector(".govuk-form2"),
    document.querySelector(".govuk-form3"),
    document.querySelector(".govuk-ending")
  ];
  
  let currentStep = 0; // a začíname pekne spolu na prvom "formuláriku"

  function showStep(index) {
    // šupneme sem cyklusík a skryjeme checkmarky 
    forms.forEach(f => f.classList.remove("govuk-form-active"));
    steps.forEach(s => s.classList.remove("active"));
    
    // a nastavíme podmienočku pre poďakovanie v závere
    if (index === 3) {
      forms[3].classList.add("govuk-form-active");
    } else {
      forms[index].classList.add("govuk-form-active");
      steps[index].classList.add("active");
    }
    
    // a naopak, cyklusík nám pre predchádzajúce nastaví completed
    steps.forEach((step, i) => {
      if (i < index) {
        step.classList.add("completed");
      } else {
        step.classList.remove("completed");
      }
    });
  }

  // prvé zobrazeníčko
  showStep(currentStep);

  // a samozrejme eventlistenerík na všetky tlačice - roztriedime si ich pomoc podmienočky
  document.body.addEventListener("click", e => {
    if (e.target.closest(".govuk-button")) {
      e.preventDefault();

      if (e.target.classList.contains("govuk-button-back")) {
        // krôčik späť pri tlačici späť
        if (currentStep > 0) {
          currentStep--;
          showStep(currentStep);
        }
      } else if (e.target.textContent.includes("Ďalej")) {
        // a potom krôčik dopredu pri tlačici ďalej, ale najprv validáciííík
        const currentForm = forms[currentStep];
        let valid = true;

        // prejdeme si všetky povinné políčka a čekneme to - vyhodíme prípadne errora
        const requiredInputs = currentForm.querySelectorAll("[data-required]");
            requiredInputs.forEach(input => {
            const errorEl = input.closest(".govuk-form-group").querySelector(".govuk-error-message");

            if (
                (input.type === "text" && input.value.trim() === "") ||
                (input.type === "checkbox" && !currentForm.querySelectorAll("input[type=checkbox]:checked").length)
            ) {
                errorEl.style.display = "block";
                input.classList.add("error"); 
                valid = false;
            } else {
                errorEl.style.display = "none";
                input.classList.remove("error");
            }
            });

        if (!valid) return; // ak nie je richtig, nepokračujeme ďalej

        if (currentStep < forms.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      } else if (e.target.textContent.includes("Odoslať")) {
        // posledná tlačica odoslať - hop rovno na ending
        const currentForm = forms[currentStep];
        let valid = true;

        const requiredInputs = currentForm.querySelectorAll("[data-required]");
        requiredInputs.forEach(input => {
          const errorEl = input.closest(".govuk-form-group").querySelector(".govuk-error-message");
          if (
            (input.type === "text" && input.value.trim() === "") ||
            (input.type === "checkbox" && !currentForm.querySelectorAll("input[type=checkbox]:checked").length)
          ) {
            errorEl.style.display = "block";
            valid = false;
          } else {
            errorEl.style.display = "none";
          }
        });

        if (!valid) return; // nepustíme ak niečo chýba, nie nie

        currentStep = 3;
        showStep(currentStep);
      }
    }
  });
});

/* Tak si pridáme ďalší event listenerík pre odškrtávanie políčok - nepovolíme odškrtnúť viac ako dve - jedine ak odznačí jednu z možností */
document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(".govuk-checkboxes__input");
  const maxAllowed = 2;
  /* cEZ CYKLUS SI TO PREJDEme nastavíme eventlistener a potom len pracujeme s podmienkou */
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const checked = Array.from(checkboxes).filter(c => c.checked);

      if (checked.length >= maxAllowed) {
        // zablokujeme nezaškrtnuté
        checkboxes.forEach(c => {
          if (!c.checked) {
            c.disabled = true;
            c.parentElement.classList.add("govuk-checkboxes__item--disabled");
          }
        });
      } else {
        // odblokujeme všetko
        checkboxes.forEach(c => {
          c.disabled = false;
          c.parentElement.classList.remove("govuk-checkboxes__item--disabled");
        });
      }
    });
  });
});