    // 키보드 사용 가능
    document.addEventListener('keydown', function(e){
        const modal = document.getElementById('galleryModal');
    
        if(!modal.classList.contains('active')) return;
    
        if(e.key === 'ArrowLeft') {
            prevImage();
        }
    
        if(e.key === 'ArrowRight') {
            nextImage();
        }
    
        if(e.key === 'Escape') {
            closeGallery();
        }
    });
    
    // 인라인 확장 뷰어 토글
    let galleryImages = [];
    let currentImage = 0;
    
    function openGallery(images) {
        galleryImages = images;
        currentImage = 0;
        createThumbs();
        updateGallery();
        document.getElementById('galleryModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeGallery() {
        document.getElementById('galleryModal').classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateGallery() {
        const img = document.getElementById('galleryImage');
        img.classList.remove('zoomed');
        img.src = galleryImages[currentImage];
        img.style.display='block';img.parentElement.classList.remove('img-missing');
        img.parentElement.scrollLeft = 0;
        img.parentElement.scrollTop = 0;
        document.getElementById('galleryCounter').innerText = (currentImage + 1) + ' / ' + galleryImages.length;
    
        document.querySelectorAll('.gallery-thumbs img').forEach((thumb,index)=>{
            thumb.classList.toggle('active', index === currentImage);
        });
    }
    
    function prevImage() {
        currentImage--;
        if(currentImage < 0) currentImage = galleryImages.length - 1;
        updateGallery();
    }

    document.addEventListener('DOMContentLoaded', function(){
    const img=document.getElementById('galleryImage');
    let isDown=false;
    let moved=false;
    let startX,startY,scrollLeft,scrollTop;
    
    img.addEventListener('click',function(){
    if(moved){
    moved=false;
    return;
    }

    this.classList.toggle('zoomed');

    if(this.classList.contains('zoomed')){
    const box=this.parentElement;

    setTimeout(()=>{
    box.scrollLeft=(this.offsetWidth-box.clientWidth)/2;
    box.scrollTop=0;
    },0);
    }
    });
    
   img.addEventListener('dragstart',function(e){ e.preventDefault(); });

    img.addEventListener('mousedown',function(e){
    if(!this.classList.contains('zoomed')) return;
    e.preventDefault();
    isDown=true;
    moved=false;
    this.parentElement.style.cursor='grabbing';
    startX=e.pageX-this.parentElement.offsetLeft;
    startY=e.pageY-this.parentElement.offsetTop;
    scrollLeft=this.parentElement.scrollLeft;
    scrollTop=this.parentElement.scrollTop;
    });
    
    img.parentElement.addEventListener('mouseleave',function(){
    isDown=false;
    });
    
    document.addEventListener('mouseup',function(){
    isDown=false;
    document.querySelector('.modal-content').style.cursor='default';
    });
    
    img.parentElement.addEventListener('mousemove',function(e){
    if(!isDown) return;
    e.preventDefault();
    if(Math.abs(e.movementX)>2 || Math.abs(e.movementY)>2) moved=true;
    const x=e.pageX-this.offsetLeft;
    const y=e.pageY-this.offsetTop;
    this.scrollLeft=scrollLeft-(x-startX);
    this.scrollTop=scrollTop-(y-startY);
    });
    });
    
    function nextImage() {
        currentImage++;
        if(currentImage >= galleryImages.length) currentImage = 0;
        updateGallery();
    }

    function createThumbs(){
        const box = document.getElementById('galleryThumbs');
        box.innerHTML = '';
    
        galleryImages.forEach((src,index)=>{
            const img = document.createElement('img');
            img.src = src;
            img.onclick = function(){
                currentImage = index;
                updateGallery();
            };
            box.appendChild(img);
        });
    }

    // 리깅 작가 선택 토글
    function toggleRigging(card) {
        const checkbox = card.querySelector('.rigging-checkbox');
        // 토글
        const isChecked = !checkbox.checked;
        
        // 단일 선택 (원한다면 유지, 다중 선택이면 이 부분 삭제)
        document.querySelectorAll('.rigging-checkbox').forEach(cb => {
            cb.checked = false;
            cb.closest('.rigging-card').classList.remove('selected');
        });

        if(isChecked) {
            checkbox.checked = true;
            card.classList.add('selected');
        }
        calc();
    }

    // 수량 조절 버튼
    function updateQty(btn, change) {
        const input = btn.parentElement.querySelector('.qty-input');
        let val = parseInt(input.value) || 0;
        val += change;
        if(val < 0) val = 0;
        input.value = val;
        calc();
    }

    // 포맷 함수 (숫자에 콤마)
    function fmt(num) {
        return num.toLocaleString() + "원";
    }

    // 실시간 계산 및 양식 생성
    function calc() {
        let total = 0;
        let categories = { "일러스트": [], "추가 요소": [], "기타": [], "저작권": [] };
        let selectedRigging = null;

        // 리깅 확인
        const rigCheck = document.querySelector('.rigging-checkbox:checked');
        if(rigCheck) {
            selectedRigging = rigCheck.closest('.rigging-card').getAttribute('data-name');
        }

        // 옵션 확인
        const rows = document.querySelectorAll('.opt-row');
        rows.forEach(row => {
            const input = row.querySelector('.qty-input');
            const qty = parseInt(input.value) || 0;
            const price = parseInt(row.getAttribute('data-price'));
            const name = row.getAttribute('data-name');
            const cat = row.getAttribute('data-category');

            if(qty > 0) {
                row.classList.add('active');
                let sum = price * qty;
                total += sum;
                if(categories[cat]) {
                    categories[cat].push(`- ${name} X ${qty} = ${fmt(sum)}`);
                }
            } else {
                row.classList.remove('active');
            }
        });

        // 텍스트 가져오기
        const nick = document.getElementById('in-nickname').value || "미작성";
        const concept = document.getElementById('in-concept').value || "미작성";
        const req = document.getElementById('in-req').value || "미작성";

        // 양식 조립
        let previewHTML = "";

        previewHTML += `<선택 옵션>\n\n`;

        if(selectedRigging) {
            previewHTML += `[리깅]\n- ${selectedRigging}\n\n`;
        }

        for (let cat in categories) {
            if(categories[cat].length > 0) {
                previewHTML += `[${cat}]\n${categories[cat].join('\n')}\n\n`;
            }
        }

        previewHTML += `[합계]\n- ${fmt(total)}\n\n`;
        previewHTML += `-------------------------\n`;
        previewHTML += `<문의 내용>\n\n`;
        previewHTML += `방송 닉네임, 방송 플랫폼 :\n${nick}\n\n`;
        previewHTML += `캐릭터 컨셉 :\n${concept}\n\n`;
        previewHTML += `기타 요청사항 :\n${req}`;
        document.getElementById('preview-area').innerText = previewHTML;
    }

    // 양식 복사
    function copyForm() {
        const text = document.getElementById('preview-area').innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert("신청 양식이 복사되었습니다.");
        });
    }

    // 초기화
    function resetForm() {
        document.querySelectorAll('.qty-input').forEach(el => el.value = 0);
        document.querySelectorAll('.rigging-checkbox').forEach(el => el.checked = false);
        document.querySelectorAll('.opt-row, .rigging-card').forEach(el => el.classList.remove('active', 'selected'));
        document.getElementById('in-nickname').value = "";
        document.getElementById('in-concept').value = "";
        document.getElementById('in-req').value = "";
        calc();
    }

    
    // 초기 계산 실행
    calc();

    // 이미지 준비중 표시
    document.querySelectorAll('img').forEach(img=>{img.onerror=function(){this.style.display='none';this.parentElement.classList.add('img-missing');};});