var myFullpage = new fullpage('#fullpage', {

});

(() => {
  const sectionProjects = document.querySelector('[data-section-projects]');
  const tableWrapper = sectionProjects.querySelector('[data-table-projects-wrapper]');
  const tableProjects = sectionProjects.querySelectorAll('[data-table-projects] tbody tr');
  const btnsFilter = sectionProjects.querySelectorAll('[data-table-btn-filter]');
  const btnPrevPage = sectionProjects.querySelector('[data-table-btn-prev-page]');
  const btnNextPage = sectionProjects.querySelector('[data-table-btn-next-page]');
  const labelCurrentPage = sectionProjects.querySelector('[data-table-projects-current-page]');
  const labelTotalPage = sectionProjects.querySelector('[data-table-projects-total-page]');

  const ROW_HEIGHT = 70;
  let currentPage = 1;
  let currentFilter = btnsFilter[0].dataset.tableBtnFilter;
  let filteredProjectsLength = tableProjects.length;
  let rowsPerPage = null;

  const updatePaginationLabels = (current, total) => {
    labelCurrentPage.innerText = current;
    labelTotalPage.innerText = total;
  }

  const updateNavBtns = (prev, next) => {
    if (currentPage === 1) {
      btnPrevPage.classList.add('btn-pagination-nav-disabled');
    } else {
      btnPrevPage.classList.remove('btn-pagination-nav-disabled');
    }

    if (currentPage === Math.ceil(filteredProjectsLength / rowsPerPage)) {
      btnNextPage.classList.add('btn-pagination-nav-disabled');
    } else {
      btnNextPage.classList.remove('btn-pagination-nav-disabled');
    }
  }

  const updatePage = page => {
    currentPage = page;
    updatePaginationLabels(currentPage, Math.ceil(filteredProjectsLength / rowsPerPage));

    let projectNumber = 1;

    tableProjects.forEach(project => {
      // Works with projects witch match current filter
      if (project.dataset.tableFilter === currentFilter || currentFilter === '') {
        const inPageRange = projectNumber > (rowsPerPage * currentPage - rowsPerPage)
          && projectNumber <= (rowsPerPage * currentPage);

        // If project correspond to current page show it, else hide
        inPageRange ? project.style.display = 'table-row' : project.style.display = 'none';
        projectNumber += 1;
      }
    })

    updateNavBtns();
  }

  const applyFilter = filter => {
    btnsFilter.forEach(btn => {
      currentFilter === btn.dataset.tableBtnFilter
        ? btn.classList.add('btn-filter-active')
        : btn.classList.remove('btn-filter-active');
    })

    // If filter is not set, show all projects
    if (filter === '') {
      tableProjects.forEach(project => {
        project.style.display = 'table-row';
      })

      filteredProjectsLength = tableProjects.length;
      updatePage(1);

      return;
    }

    // Apply filter
    let filteredProjectQuantify = 0;

    tableProjects.forEach(project => {
      if (project.dataset.tableFilter === filter) {
        filteredProjectQuantify++;
        project.style.display = 'table-row';
      } else {
        project.style.display = 'none';
      }
    })

    filteredProjectsLength = filteredProjectQuantify;
    updatePage(1);
  }

  const calcRowsPerPage = () => {
    rowsPerPage = parseInt(window.innerHeight / ROW_HEIGHT, 10);

    // Set min-height
    const tableMinHeight = rowsPerPage * ROW_HEIGHT;
    tableWrapper.style.minHeight = `${tableMinHeight}px`;

    updatePaginationLabels(1, Math.ceil(tableProjects.length / rowsPerPage));
    updatePage(1);
  }

  const checkFilter = () => {
    btnsFilter.forEach(btn => {
      // If button has attribute 'data-table-default-filter' apply this filter
      if (btn.dataset.tableDefaultFilter === '') {
        currentFilter = btn.dataset.tableBtnFilter;
        applyFilter(currentFilter);
      }
    })

    if (currentFilter === '') {
      btnsFilter[0].classList.add('btn-filter-active');
    }
  }

  // Add listeners
  window.addEventListener('load', () => {
    calcRowsPerPage();
    checkFilter();
    updateNavBtns();
  });

  window.addEventListener('resize', () => {
    if (rowsPerPage === parseInt(window.innerHeight / ROW_HEIGHT, 10)) return;

    calcRowsPerPage();
  });

  btnsFilter.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();

      currentFilter = btn.dataset.tableBtnFilter;
      applyFilter(currentFilter);
    })
  })

  btnPrevPage.addEventListener('click', e => {
    e.preventDefault();

    if (currentPage === 1) return;

    updatePage(currentPage - 1);
  })

  btnNextPage.addEventListener('click', e => {
    e.preventDefault();

    if (currentPage === Math.ceil(filteredProjectsLength / rowsPerPage)) return;

    updatePage(currentPage + 1);
  })
})();